FROM python:3.11-slim

# ตั้งโฟลเดอร์ทำงานเป็น /app
WORKDIR /app

# ก๊อปปี้ไฟล์ requirements มาลงก่อน (เพื่อ Cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ก๊อปปี้ไฟล์โปรเจกต์ทั้งหมด (.) เข้าไปใน Container (.)
COPY . .

# สร้างโฟลเดอร์ instance สำหรับเก็บ Database
RUN mkdir -p instance

# เปิด Port 5000
EXPOSE 5000

# คำสั่งรัน Flask
CMD ["python", "app.py"]