import tkinter as tk
from tkinter import filedialog, messagebox
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import hashlib

# Función para guardar la clave privada en un archivo PEM
def guardar_clave_privada(clave_privada, nombre_archivo):
    with open(nombre_archivo, 'wb') as archivo_clave_privada:
        archivo_clave_privada.write(
            clave_privada.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
        )

# Función para guardar la clave pública en un archivo PEM
def guardar_clave_publica(clave_publica, nombre_archivo):
    with open(nombre_archivo, 'wb') as archivo_clave_publica:
        archivo_clave_publica.write(
            clave_publica.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
        )

# Función para leer una clave privada desde un archivo PEM
def cargar_clave_privada_desde_archivo(ruta_archivo):
    with open(ruta_archivo, 'rb') as archivo_clave_privada:
        clave_privada = serialization.load_pem_private_key(
            archivo_clave_privada.read(),
            password=None,
            backend=default_backend()
        )
    return clave_privada

# Función para leer una clave pública desde un archivo PEM
def cargar_clave_publica_desde_archivo(ruta_archivo):
    with open(ruta_archivo, 'rb') as archivo_clave_publica:
        clave_publica = serialization.load_pem_public_key(
            archivo_clave_publica.read(),
            backend=default_backend()
        )
    return clave_publica

# Función para firmar el contenido usando la clave privada RSA
def firmar_contenido(contenido, clave_privada):
    digesto = hashlib.sha256(contenido.encode('utf-8')).digest()
    print(digesto)
    firma = clave_privada.sign(
        digesto,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return firma

# Función para extraer el contenido y la firma digital del archivo
def extraer_contenido_y_firma(ruta):
    with open(ruta, 'r', encoding='utf-8') as archivo:
        lineas = archivo.readlines()

    firma_inicio = None
    for i, linea in enumerate(lineas):
        if "--- Firma Digital ---" in linea.strip():
            firma_inicio = i + 1
            break
    
    if firma_inicio is None or firma_inicio >= len(lineas):
        raise ValueError("Firma digital no encontrada en el archivo.")

    contenido = ''.join(lineas[:firma_inicio-1]).strip()
    firma_digital = bytes.fromhex(lineas[firma_inicio].strip())   
    
    return contenido, firma_digital



# Función para verificar la firma digital usando la clave pública RSA
def verificar_firma(contenido, firma_digital, clave_publica):
    digesto = hashlib.sha256(contenido.encode('utf-8')).digest()
    print(digesto)
    try:
        clave_publica.verify(
            firma_digital,
            digesto,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except Exception as e:
        print(f"Error al verificar la firma: {e}")
        return False

# Función para seleccionar un archivo
def seleccionar_archivo():
    ruta_archivo = filedialog.askopenfilename(
        title="Seleccione un archivo de texto",
        filetypes=[("Archivos de texto", "*.txt")]
    )
    entrada_archivo.delete(0, tk.END)
    entrada_archivo.insert(0, ruta_archivo)

# Función para seleccionar una clave privada
def seleccionar_clave_privada():
    ruta_clave_privada = filedialog.askopenfilename(
        title="Seleccione la clave privada para firmar",
        filetypes=[("Archivos PEM", "*.pem")]
    )
    entrada_clave_privada.delete(0, tk.END)
    entrada_clave_privada.insert(0, ruta_clave_privada)

# Función para seleccionar una clave pública
def seleccionar_clave_publica():
    ruta_clave_publica = filedialog.askopenfilename(
        title="Seleccione la clave pública para verificar",
        filetypes=[("Archivos PEM", "*.pem")]
    )
    entrada_clave_publica.delete(0, tk.END)
    entrada_clave_publica.insert(0, ruta_clave_publica)

# Función principal para leer el contenido de un archivo
def leer_archivo(ruta):
    with open(ruta, 'r', encoding='utf-8') as archivo:
        contenido = archivo.read()
    return contenido

# Función para escribir el contenido en un nuevo archivo con la firma digital
def escribir_archivo_con_firma(ruta_original, contenido, firma):
    ruta_nuevo_archivo = ruta_original.replace(".txt", "_f.txt")
    with open(ruta_nuevo_archivo, 'w', encoding='utf-8') as archivo:
        archivo.write(contenido)
        archivo.write("\n\n--- Firma Digital ---\n")
        archivo.write(firma.hex())
    return ruta_nuevo_archivo

# Función para firmar un archivo seleccionado
def firmar_archivo():
    try:
        ruta_archivo = entrada_archivo.get()
        contenido = leer_archivo(ruta_archivo)
        clave_privada = cargar_clave_privada_desde_archivo(entrada_clave_privada.get())
        firma = firmar_contenido(contenido, clave_privada)
        ruta_nuevo_archivo = escribir_archivo_con_firma(ruta_archivo, contenido, firma)
        messagebox.showinfo("Éxito", f"El archivo ha sido firmado exitosamente. Nuevo archivo: {ruta_nuevo_archivo}")
    except Exception as e:
        messagebox.showerror("Error", f"Ha ocurrido un error al firmar el archivo: {e}")

# Función para verificar la firma digital de un archivo seleccionado
def verificar_firma_archivo():
    try:
        ruta_archivo = entrada_archivo.get()
        contenido, firma_digital = extraer_contenido_y_firma(ruta_archivo)
        clave_publica = cargar_clave_publica_desde_archivo(entrada_clave_publica.get())
        if verificar_firma(contenido, firma_digital, clave_publica):
            messagebox.showinfo("Verificación", "Firma digital válida. Autentificación, Integridad y No-repudio garantizados.")
        else:
            messagebox.showerror("Verificación", "Firma digital inválida. :( ")
    except Exception as e:
        messagebox.showerror("Error", f"Ha ocurrido un error al verificar la firma digital: {e}")

# Función para mostrar la clave pública en formato PEM
def mostrar_clave_publica(clave_publica):
    try:
        pem = clave_publica.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        print("Clave Pública en formato PEM:\n", pem)
    except Exception as e:
        print(f"Error al mostrar la clave pública: {e}")

# Configuración de la interfaz gráfica
ventana = tk.Tk()
ventana.title("Firma Digital y Verificación")
ventana.geometry("400x400")

etiqueta_archivo = tk.Label(ventana, text="Archivo de texto:")
etiqueta_archivo.pack(pady=5)
entrada_archivo = tk.Entry(ventana, width=50)
entrada_archivo.pack(pady=5)

boton_archivo = tk.Button(ventana, text="Seleccionar archivo", command=seleccionar_archivo)
boton_archivo.pack(pady=5)

etiqueta_clave_privada = tk.Label(ventana, text="Clave privada (PEM):")
etiqueta_clave_privada.pack(pady=5)
entrada_clave_privada = tk.Entry(ventana, width=50)
entrada_clave_privada.pack(pady=5)

boton_clave_privada = tk.Button(ventana, text="Seleccionar clave privada", command=seleccionar_clave_privada)
boton_clave_privada.pack(pady=5)

etiqueta_clave_publica = tk.Label(ventana, text="Clave pública (PEM):")
etiqueta_clave_publica.pack(pady=5)
entrada_clave_publica = tk.Entry(ventana, width=50)
entrada_clave_publica.pack(pady=5)

boton_clave_publica = tk.Button(ventana, text="Seleccionar clave pública", command=seleccionar_clave_publica)
boton_clave_publica.pack(pady=5)

boton_firmar = tk.Button(ventana, text="Firmar archivo", command=firmar_archivo)
boton_firmar.pack(pady=10)

boton_verificar = tk.Button(ventana, text="Verificar firma digital", command=verificar_firma_archivo)
boton_verificar.pack(pady=10)

ventana.mainloop()
