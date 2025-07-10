import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Schema de validação
const schema = yup.object({
    cardNumber: yup.string().required('N° do Card é obrigatório'),
    projectName: yup.string().required('Nome do Projeto é obrigatório'),
    technicalAnalyst: yup.string(),
    gmud: yup.string(),
    date: yup.string().required('Data é obrigatória'),
    version: yup.string().required('Versão é obrigatória'),
    environment: yup.string().required('Ambiente de Desenvolvimento é obrigatório'),
    author: yup.string().required('Autor é obrigatório'),
    comment: yup.string(),
    developmentDescription: yup.string().required('Descrição do Desenvolvimento é obrigatória'),
    functionalSpecification: yup.string().required('Especificação Funcional é obrigatória'),
    changeDescription: yup.string().required('Descrição da Mudança é obrigatória'),
    order: yup.string(),
    requests: yup.array().of(
        yup.object({
            description: yup.string().required('Descrição da request é obrigatória')
        })
    ).min(1, 'Pelo menos uma request é obrigatória'),
    status: yup.string().required('Status é obrigatório'),
    startDateTime: yup.string().required('Data/Horário de Início é obrigatório'),
    endDateTime: yup.string()
});

interface FormData {
    cardNumber: string;
    projectName: string;
    technicalAnalyst: string;
    gmud: string;
    date: string;
    version: string;
    environment: string;
    author: string;
    comment: string;
    developmentDescription: string;
    functionalSpecification: string;
    changeDescription: string;
    order: string;
    requests: { description: string }[];
    status: string;
    startDateTime: string;
    endDateTime: string;
}

interface Props {
    initialData?: any;
    onSubmit: (data: any) => void;
    isEdit?: boolean;
}

const FunctionalSpecificationForm: React.FC<Props> = ({
    initialData,
    onSubmit,
    isEdit = false
}) => {
    const [processDiagram, setProcessDiagram] = useState<File | null>(null);
    const [unitTests, setUnitTests] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            cardNumber: initialData?.cardNumber || '',
            projectName: initialData?.projectName || '',
            technicalAnalyst: 'Analista Atual', // Preenchido automaticamente
            gmud: initialData?.gmud || '',
            date: initialData?.date || '',
            version: initialData?.version || '1.0',
            environment: initialData?.environment || '',
            author: 'Usuário Logado', // Preenchido automaticamente
            comment: initialData?.comment || '',
            developmentDescription: initialData?.developmentDescription || '',
            functionalSpecification: initialData?.functionalSpecification || '',
            changeDescription: initialData?.changeDescription || '',
            order: initialData?.order || '',
            requests: initialData?.requests || [{ description: '' }],
            status: initialData?.status || '',
            startDateTime: initialData?.startDateTime || '',
            endDateTime: initialData?.endDateTime || ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'requests'
    });

    const handleProcessDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProcessDiagram(file);
        }
    };

    const handleUnitTestsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUnitTests(files);
    };

    const onFormSubmit = (data: any) => {
        const formData = {
            ...data,
            processDiagram,
            unitTests
        };
        onSubmit(formData);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

            <form onSubmit={handleSubmit(onFormSubmit)}>

                {/* Informações Básicas */}
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3 style={{ marginTop: 0, color: '#333' }}>📋 Informações Básicas</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                N° do Card *
                            </label>
                            <input
                                {...register('cardNumber')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.cardNumber ? '#dc3545' : '#ccc'
                                }}
                                placeholder="Ex: CARD-2024-001"
                            />
                            {errors.cardNumber && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.cardNumber.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Nome do Projeto *
                            </label>
                            <input
                                {...register('projectName')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.projectName ? '#dc3545' : '#ccc'
                                }}
                                placeholder="Nome do projeto"
                            />
                            {errors.projectName && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.projectName.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Analista Técnico
                            </label>
                            <input
                                {...register('technicalAnalyst')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f8f9fa'
                                }}
                                readOnly
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                GMUD
                            </label>
                            <input
                                {...register('gmud')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                                placeholder="Número da GMUD"
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Data *
                            </label>
                            <input
                                type="date"
                                {...register('date')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.date ? '#dc3545' : '#ccc'
                                }}
                            />
                            {errors.date && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.date.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Versão *
                            </label>
                            <input
                                {...register('version')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.version ? '#dc3545' : '#ccc'
                                }}
                                placeholder="1.0"
                            />
                            {errors.version && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.version.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Ambiente de Desenvolvimento *
                            </label>
                            <select
                                {...register('environment')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.environment ? '#dc3545' : '#ccc'
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="EQ0">EQ0</option>
                                <option value="EP0">EP0</option>
                                <option value="ED0">ED0</option>
                            </select>
                            {errors.environment && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.environment.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Autor *
                            </label>
                            <input
                                {...register('author')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f8f9fa'
                                }}
                                readOnly
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                            Comentário
                        </label>
                        <textarea
                            {...register('comment')}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                minHeight: '80px',
                                resize: 'vertical'
                            }}
                            placeholder="Comentários adicionais..."
                        />
                    </div>
                </div>

                {/* Descrições */}
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3 style={{ marginTop: 0, color: '#333' }}>📝 Descrições</h3>

                    <div>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                            Descrição do Desenvolvimento *
                        </label>
                        <textarea
                            {...register('developmentDescription')}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                minHeight: '100px',
                                resize: 'vertical',
                                borderColor: errors.developmentDescription ? '#dc3545' : '#ccc'
                            }}
                            placeholder="Descreva o desenvolvimento que será realizado..."
                        />
                        {errors.developmentDescription && (
                            <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                {errors.developmentDescription.message}
                            </span>
                        )}
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                            Especificação Funcional *
                        </label>
                        <textarea
                            {...register('functionalSpecification')}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                minHeight: '120px',
                                resize: 'vertical',
                                borderColor: errors.functionalSpecification ? '#dc3545' : '#ccc'
                            }}
                            placeholder="Detalhe a especificação funcional..."
                        />
                        {errors.functionalSpecification && (
                            <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                {errors.functionalSpecification.message}
                            </span>
                        )}
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                            Descrição da Mudança *
                        </label>
                        <textarea
                            {...register('changeDescription')}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                minHeight: '100px',
                                resize: 'vertical',
                                borderColor: errors.changeDescription ? '#dc3545' : '#ccc'
                            }}
                            placeholder="Descreva as mudanças que serão implementadas..."
                        />
                        {errors.changeDescription && (
                            <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                {errors.changeDescription.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Arquivos */}
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3 style={{ marginTop: 0, color: '#333' }}>📎 Arquivos</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Diagrama de Processo
                            </label>
                            <input
                                type="file"
                                onChange={handleProcessDiagramUpload}
                                accept=".jpg,.jpeg,.png,.gif,.pdf"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                            {processDiagram && (
                                <div style={{ marginTop: '5px', color: '#28a745', fontSize: '14px' }}>
                                    ✅ {processDiagram.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Testes Unitários
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleUnitTestsUpload}
                                accept=".jpg,.jpeg,.png,.pdf,.txt,.js,.py,.java,.cs"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                            {unitTests.length > 0 && (
                                <div style={{ marginTop: '5px', color: '#28a745', fontSize: '14px' }}>
                                    ✅ {unitTests.length} arquivo(s) selecionado(s)
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Ordem
                            </label>
                            <input
                                {...register('order')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                                placeholder="Ordem de execução"
                            />
                        </div>
                    </div>
                </div>

                {/* Requests */}
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3 style={{ marginTop: 0, color: '#333' }}>📋 Requests</h3>

                    {fields.map((field, index) => (
                        <div key={field.id} style={{
                            display: 'flex',
                            alignItems: 'end',
                            gap: '10px',
                            marginBottom: '10px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                    Request {index + 1} *
                                </label>
                                <textarea
                                    {...register(`requests.${index}.description`)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        minHeight: '60px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Descreva a request..."
                                />
                            </div>
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    style={{
                                        padding: '10px 15px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))}

                    {errors.requests && (
                        <div style={{ color: '#dc3545', fontSize: '14px', marginBottom: '10px' }}>
                            {errors.requests.message}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => append({ description: '' })}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ➕ Adicionar Request
                    </button>
                </div>

                {/* Status e Datas */}
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3 style={{ marginTop: 0, color: '#333' }}>⏱️ Status e Cronograma</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Status *
                            </label>
                            <select
                                {...register('status')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.status ? '#dc3545' : '#ccc'
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Em andamento">Em andamento</option>
                                <option value="Pronto">Pronto</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Em análise">Em análise</option>
                                <option value="Aprovado">Aprovado</option>
                            </select>
                            {errors.status && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.status.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Data/Horário de Início *
                            </label>
                            <input
                                type="datetime-local"
                                {...register('startDateTime')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    borderColor: errors.startDateTime ? '#dc3545' : '#ccc'
                                }}
                            />
                            {errors.startDateTime && (
                                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                                    {errors.startDateTime.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                                Data/Horário de Fim
                            </label>
                            <input
                                type="datetime-local"
                                {...register('endDateTime')}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    marginTop: '30px'
                }}>
                    <button
                        type="submit"
                        style={{
                            padding: '15px 40px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isEdit ? '✏️ Atualizar' : '➕ Criar'} Especificação Funcional
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FunctionalSpecificationForm;
