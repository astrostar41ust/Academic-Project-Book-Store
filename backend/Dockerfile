# Stage 1: Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /code

# Copy the dependencies file to the working directory
COPY ./requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application's code from the host to the container
COPY ./app /code/app

# Command to run the application using uvicorn server
# 0.0.0.0 makes the server accessible from outside the container within the Docker network
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
