import React, {useCallback, useState} from 'react';
import {ITest} from 'entities/Test';
import styles from './TestTemplateUpload.module.scss'; // Импорт SCSS модуля

interface TestTemplateUploadProps {
    handleUpdateTest: (test: ITest) => void;
}

export const TestTemplateUpload = (props: TestTemplateUploadProps) => {
    const { handleUpdateTest } = props;
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Обработчик загрузки файла
    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = () => {
            try {
                const parsedData = JSON.parse(reader.result as string) as ITest;
                console.log({ abs: { ...parsedData, _id: '6783eb2605cae400b63ac62e' } });
                handleUpdateTest({ ...parsedData, _id: '6783eb2605cae400b63ac62e' });
                setError(null);
            } catch (err) {
                setError('Ошибка при парсинге JSON-файла.');
            }
        };

        reader.onerror = () => {
            setError('Ошибка при чтении файла.');
        };
    }, [handleUpdateTest]);

    // Обработчик изменения файла через input
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        } else {
            setError('Файл не выбран.');
        }
    };

    // Обработчик drag and drop
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (file && file.type === 'application/json') {
            handleFileUpload(file);
        } else {
            setError('Пожалуйста, загрузите файл в формате JSON.');
        }
    };

    return (
        <div
            className={`${styles.uploadContainer} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".json"
                onChange={handleInputChange}
                id="fileInput"
                className={styles.fileInput}
            />
            <label htmlFor="fileInput" className={styles.uploadLabel}>
                Файл с шаблоном теста сюда или <span>выберите файл</span>
            </label>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};
