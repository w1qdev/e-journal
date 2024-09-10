# Используем официальный образ Python
FROM python:3.11.9-slim

# Устанавливаем зависимости для работы с сетью и компиляцией
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Копируем файл с зависимостями
COPY requirements.txt ./requirements.txt

# Обновляем pip перед установкой зависимостей
RUN pip install --upgrade pip

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r ./requirements.txt

# Копируем все файлы проекта в контейнер
COPY . .

# Устанавливаем рабочую директорию
WORKDIR .

# Запускаем приложение
CMD ["python", "__index__.py"]