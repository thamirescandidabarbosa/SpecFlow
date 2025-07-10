# 📝 Documentação Técnica do SpecFlow

*Documento Consolidado - Informações técnicas essenciais do projeto*

## Índice
1. [Sistema de Anexos e Uploads](#sistema-de-anexos-e-uploads)
2. [Geração de PDF](#geração-de-pdf)
3. [Regras de Negócio e Autorização](#regras-de-negócio-e-autorização)
4. [Componentes da Interface](#componentes-da-interface)

---

## Sistema de Anexos e Uploads

### 📋 Visão Geral
O sistema de anexos permite o upload e gerenciamento de arquivos associados às Especificações Funcionais (EFs), incluindo diagramas, documentos técnicos e outros tipos de arquivos.

### 🔧 Implementação

1. **Backend (NestJS)**

   ```typescript
   // Controller para upload de arquivos
   @Controller('files')
   export class FilesController {
     constructor(private readonly filesService: FilesService) {}
   
     @Post('upload')
     @UseInterceptors(FileInterceptor('file', {
       storage: diskStorage({
         destination: './uploads',
         filename: (req, file, cb) => {
           const uniqueName = randomUUID();
           const extension = extname(file.originalname);
           cb(null, `${uniqueName}${extension}`);
         },
       }),
       fileFilter: (req, file, cb) => {
         const allowedTypes = [
           'image/jpeg', 'image/png', 'application/pdf',
           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         ];
         
         if (allowedTypes.includes(file.mimetype)) {
           cb(null, true);
         } else {
           cb(new BadRequestException('Tipo de arquivo não permitido'), false);
         }
       },
     }))
     async uploadFile(@UploadedFile() file: Express.Multer.File) {
       return this.filesService.saveFile(file);
     }
   }
   ```

2. **Frontend (React)**

   ```typescript
   // Upload de arquivos
   const uploadFile = async (file, efId) => {
     const formData = new FormData();
     formData.append('file', file);
     
     try {
       setIsUploading(true);
       const response = await api.post(`/ef/${efId}/upload/attachment`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       });
       
       return response.data;
     } catch (error) {
       console.error('Erro ao fazer upload:', error);
       throw error;
     } finally {
       setIsUploading(false);
     }
   };
   ```

### 🔍 Validação de Arquivos

- Verificação de tipo MIME
- Limite de tamanho (10MB por arquivo)
- Sanitização de nomes de arquivos
- Verificação de malware (em ambiente de produção)

---

## Geração de PDF

### 📋 Visão Geral
O sistema permite gerar arquivos PDF a partir das Especificações Funcionais, mantendo formatação consistente e incluindo todos os dados relevantes.

### 🔧 Implementação

1. **Backend (NestJS com PDFKit)**

   ```typescript
   @Injectable()
   export class PdfService {
     async generateEfPdf(ef: FunctionalSpecification): Promise<Buffer> {
       return new Promise((resolve) => {
         const doc = new PDFDocument({ 
           margin: 50,
           size: 'A4'
         });
         
         const buffers = [];
         doc.on('data', buffers.push.bind(buffers));
         doc.on('end', () => {
           const pdfData = Buffer.concat(buffers);
           resolve(pdfData);
         });
         
         // Cabeçalho
         doc.fontSize(22).text('Especificação Funcional', { align: 'center' });
         doc.moveDown();
         doc.fontSize(16).text(ef.title, { align: 'center' });
         doc.moveDown();
         
         // Informações básicas
         doc.fontSize(14).text('Informações Gerais');
         doc.moveDown(0.5);
         doc.fontSize(12).text(`ID: ${ef.id}`);
         doc.fontSize(12).text(`Criado em: ${format(new Date(ef.createdAt), 'dd/MM/yyyy')}`);
         doc.fontSize(12).text(`Status: ${ef.status}`);
         doc.fontSize(12).text(`Responsável: ${ef.responsavel || 'Não definido'}`);
         doc.moveDown();
         
         // Seções
         if (ef.sections && ef.sections.length) {
           ef.sections.forEach(section => {
             doc.fontSize(14).text(section.title);
             doc.moveDown(0.5);
             doc.fontSize(12).text(section.content || 'Sem conteúdo');
             doc.moveDown();
           });
         }
         
         doc.end();
       });
     }
   }
   ```

2. **Frontend (React)**

   ```typescript
   const downloadPdf = async (efId) => {
     try {
       setIsDownloading(true);
       const response = await api.get(`/ef/${efId}/generate-pdf`, {
         responseType: 'blob',
       });
       
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', `EF-${efId}.pdf`);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     } catch (error) {
       console.error('Erro ao baixar PDF:', error);
       toast.error('Erro ao gerar PDF. Tente novamente.');
     } finally {
       setIsDownloading(false);
     }
   };
   ```

---

## Regras de Negócio e Autorização

### 📋 Visão Geral
O sistema implementa um conjunto de regras de negócio e autorização para garantir que apenas usuários autorizados possam acessar, criar ou modificar Especificações Funcionais.

### 🔧 Implementação

1. **Regras de Autorização**

   ```typescript
   @Injectable()
   export class AuthGuard implements CanActivate {
     constructor(private jwtService: JwtService) {}
   
     async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const token = this.extractTokenFromHeader(request);
       
       if (!token) {
         throw new UnauthorizedException('Token não encontrado');
       }
       
       try {
         const payload = await this.jwtService.verifyAsync(token);
         request.user = payload;
         return true;
       } catch {
         throw new UnauthorizedException('Token inválido');
       }
     }
   
     private extractTokenFromHeader(request: Request): string | undefined {
       const [type, token] = request.headers.authorization?.split(' ') ?? [];
       return type === 'Bearer' ? token : undefined;
     }
   }
   ```

2. **Regras para Edição de EF**

   ```typescript
   @Injectable()
   export class EfService {
     constructor(private prisma: PrismaService) {}
   
     async update(id: string, updateEfDto: UpdateEfDto, userId: string) {
       const ef = await this.prisma.functionalSpec.findUnique({
         where: { id },
         include: { responsavel: true }
       });
   
       if (!ef) {
         throw new NotFoundException('Especificação não encontrada');
       }
   
       // Verificar se o usuário pode editar
       const user = await this.prisma.user.findUnique({ where: { id: userId } });
       
       if (!user) {
         throw new UnauthorizedException('Usuário não encontrado');
       }
       
       const canEdit = user.role === 'ADMIN' || 
                        user.id === ef.responsavelId ||
                        ef.status === 'DRAFT';
                        
       if (!canEdit) {
         throw new ForbiddenException('Você não tem permissão para editar esta especificação');
       }
   
       return this.prisma.functionalSpec.update({
         where: { id },
         data: updateEfDto,
       });
     }
   }
   ```

---

## Componentes da Interface

### 📋 Visão Geral
O frontend do sistema é construído com componentes React reutilizáveis para garantir consistência e facilitar a manutenção.

### 🔧 Principais Componentes

1. **Dashboard**

   ```tsx
   const Dashboard = () => {
     const [efs, setEfs] = useState([]);
     const [loading, setLoading] = useState(true);
     const [filters, setFilters] = useState({ status: 'all', search: '' });
     
     useEffect(() => {
       fetchEfs();
     }, [filters]);
     
     const fetchEfs = async () => {
       try {
         setLoading(true);
         const response = await api.get('/ef', { 
           params: { 
             status: filters.status !== 'all' ? filters.status : undefined,
             search: filters.search || undefined
           } 
         });
         setEfs(response.data);
       } catch (error) {
         console.error('Erro ao buscar EFs:', error);
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <div className="dashboard">
         <h1>Dashboard</h1>
         <div className="filters">
           {/* Filtros aqui */}
         </div>
         
         {loading ? (
           <LoadingSpinner />
         ) : (
           <div className="ef-grid">
             {efs.map(ef => (
               <EfCard key={ef.id} ef={ef} />
             ))}
           </div>
         )}
       </div>
     );
   };
   ```

2. **Formulário de EF**

   ```tsx
   const EfForm = ({ efId }) => {
     const { register, handleSubmit, control, formState: { errors } } = useForm();
     const [sections, setSections] = useState([]);
     const [loading, setLoading] = useState(false);
     
     // Implementação do formulário
     // ...
     
     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         {/* Campos do formulário */}
         <div className="form-sections">
           {sections.map((section, index) => (
             <Section 
               key={section.id || index} 
               section={section} 
               index={index}
               register={register}
               errors={errors}
               onRemove={() => handleRemoveSection(index)}
             />
           ))}
           <button type="button" onClick={handleAddSection}>
             Adicionar Seção
           </button>
         </div>
         
         <div className="form-actions">
           <button type="submit" disabled={loading}>
             {loading ? 'Salvando...' : 'Salvar'}
           </button>
         </div>
       </form>
     );
   };
   ```

---

© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
