# 🛠️ Soluções de Problemas com Frontend

*Documento Consolidado - Soluções para problemas relacionados ao Frontend*

## Índice
1. [Problemas com TypeScript e Cache](#problemas-com-typescript-e-cache)
2. [Soluções para Edição de EF](#soluções-para-edição-de-ef)
3. [Correções de Dependências](#correções-de-dependências)

---

## Problemas com TypeScript e Cache

### ⚠️ Sintomas
- Erros de compilação TypeScript mesmo após correções
- Mensagens de erro inconsistentes
- Autocompletar não funcionando corretamente
- Definições de tipos não sendo reconhecidas

### 🔍 Diagnóstico
O VSCode pode estar com cache de arquivos TypeScript obsoleto, o que causa erros de compilação mesmo quando o código está correto.

### ✅ Solução

1. **Limpar o cache do TypeScript Server**
   ```bash
   # Via script automatizado
   limpar-cache-typescript.bat
   
   # Ou manualmente:
   # 1. Pressione Ctrl+Shift+P no VSCode
   # 2. Digite e selecione "TypeScript: Restart TS Server"
   ```

2. **Regenerar os arquivos de cache**
   ```bash
   # No frontend
   cd frontend
   rm -rf node_modules/.cache
   npm run start
   
   # No backend
   cd backend
   rm -rf dist
   npm run start:dev
   ```

3. **Validar tsconfig.json**
   - Verificar se as configurações de paths estão corretas
   - Garantir que os arquivos necessários estão incluídos

---

## Soluções para Edição de EF

### ⚠️ Problema
A edição de Especificações Funcionais apresenta falhas, como:
- Dados não são salvos corretamente
- Formulários perdem dados ao alternar entre seções
- Campos obrigatórios não validam corretamente

### 🔍 Análise
O problema ocorre principalmente devido ao estado não ser gerenciado adequadamente entre componentes e à falta de sincronização com o backend.

### ✅ Correção

1. **Implementação de estado global**
   ```typescript
   // Utilize o Context API para compartilhar estado
   import { createContext, useContext, useState } from 'react';
   
   export const EFContext = createContext({});
   
   export const EFProvider = ({ children }) => {
     const [ef, setEF] = useState({});
     const [isSaving, setIsSaving] = useState(false);
     
     const updateEF = (data) => {
       setEF(prev => ({ ...prev, ...data }));
     };
     
     return (
       <EFContext.Provider value={{ ef, updateEF, isSaving, setIsSaving }}>
         {children}
       </EFContext.Provider>
     );
   };
   ```

2. **Melhorias no formulário**
   ```typescript
   // Utilize FormProvider do React Hook Form
   import { FormProvider, useForm } from 'react-hook-form';
   
   const methods = useForm({
     mode: 'onChange',
     defaultValues: ef,
   });
   
   // Ajuste para persistir dados entre abas
   useEffect(() => {
     if (ef?.id) {
       methods.reset(ef);
     }
   }, [ef, methods]);
   
   // Salvar progresso automaticamente
   const handleAutoSave = debounce(async (data) => {
     if (ef?.id) {
       await updateEF(ef.id, data);
     }
   }, 2000);
   ```

3. **Solução para problema de campos aninhados**
   ```typescript
   // Resolva problemas de validação de objetos aninhados
   register(`sections.${index}.title`, { 
     required: "Título é obrigatório" 
   });
   
   // Ao invés de:
   register("sections", { 
     required: true 
   });
   ```

---

## Correções de Dependências

### ⚠️ Sintomas
- Erros `Cannot find module`
- Componentes quebram após `npm install`
- Versões conflitantes

### 🔍 Diagnóstico
Conflitos entre versões de pacotes ou pacotes faltantes no projeto frontend.

### ✅ Solução

1. **Limpar instalação**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Corrigir pacotes específicos**
   ```bash
   # Instalar pacotes faltantes
   npm install react-hook-form@7.43.0 @hookform/resolvers yup lucide-react
   
   # Corrigir conflitos com versões específicas
   npm install @types/react@18.0.28 @types/react-dom@18.0.11
   ```

3. **Verificar configuração do TypeScript**
   ```json
   // tsconfig.json - Ajustes recomendados
   {
     "compilerOptions": {
       "target": "ES2020",
       "lib": ["DOM", "DOM.Iterable", "ESNext"],
       "allowJs": true,
       "skipLibCheck": true,
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noFallthroughCasesInSwitch": true,
       "module": "ESNext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx"
     },
     "include": ["src"]
   }
   ```

---

© 2025 Thamires Candida Barbosa. Todos os direitos reservados.
