from supabase import create_client
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import cv2
import numpy as np
import tempfile
import os
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_PATH = "rostros"

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = (
    create_client(SUPABASE_URL, SUPABASE_KEY)
    if SUPABASE_URL and SUPABASE_KEY
    else None
)

NOMBRES_PERSONAS = {
    "Nik_Llaguento": "Nik Llaguento Gamarra",
    "Usuario_Dos": "Nicols Lopez Haro",
    "Usuario_Tres": "Josue Maucaylla Gonzales",
}


@app.get("/")
def home():
    return {"message": "Backend IA con DeepFace activo"}


def validar_horario():
    if supabase is None:
        return True, "Horario no validado"

    try:
        response = supabase.table("horarios").select("*").limit(1).execute()

        if not response.data:
            return True, "Sin configuración de horario"

        config = response.data[0]

        ahora = datetime.now()
        hora_actual = ahora.strftime("%H:%M")
        dia_semana = ahora.weekday()

        if config.get("modo_feriado"):
            return False, "Acceso bloqueado por modo feriado"

        if dia_semana >= 5 and not config.get("permitir_fines_semana"):
            return False, "Acceso fuera de horario: fines de semana no permitidos"

        hora_entrada = str(config.get("hora_entrada", "08:00"))[:5]
        hora_salida = str(config.get("hora_salida", "18:00"))[:5]

        if hora_actual < hora_entrada or hora_actual > hora_salida:
            return False, f"Acceso fuera de horario permitido ({hora_entrada} - {hora_salida})"

        return True, "Horario permitido"

    except Exception as e:
        print("Error validando horario:", e)
        return True, "Horario no validado"


@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    temp_path = None

    try:
        contenido = await file.read()

        np_array = np.frombuffer(contenido, np.uint8)
        imagen = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if imagen is None:
            return {
                "success": False,
                "status": "denied",
                "message": "No se pudo procesar la imagen",
            }

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        temp_path = temp_file.name
        temp_file.close()

        cv2.imwrite(temp_path, imagen)

        resultado = DeepFace.find(
            img_path=temp_path,
            db_path=DATABASE_PATH,
            enforce_detection=False,
            silent=True,
        )

        if isinstance(resultado, list) and len(resultado) > 0:
            df_resultado = resultado[0]

            if isinstance(df_resultado, pd.DataFrame) and not df_resultado.empty:
                persona = df_resultado.iloc[0]
                ruta = persona["identity"]

                nombre_carpeta = os.path.basename(os.path.dirname(str(ruta)))
                nombre = NOMBRES_PERSONAS.get(
                    nombre_carpeta,
                    nombre_carpeta.replace("_", " "),
                )

                horario_valido, mensaje_horario = validar_horario()

                if not horario_valido:
                    return {
                        "success": True,
                        "status": "out_of_schedule",
                        "message": mensaje_horario,
                        "person": {
                            "name": nombre,
                            "folder": nombre_carpeta,
                            "area": "OGTI - Soporte Técnico",
                            "role": "Personal autorizado",
                        },
                    }

                return {
                    "success": True,
                    "status": "authorized",
                    "message": "Acceso autorizado",
                    "person": {
                        "name": nombre,
                        "folder": nombre_carpeta,
                        "area": "OGTI - Soporte Técnico",
                        "role": "Personal autorizado",
                    },
                }

        return {
            "success": False,
            "status": "denied",
            "message": "Rostro no reconocido",
        }

    except Exception as e:
        return {
            "success": False,
            "status": "error",
            "message": str(e),
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/register-person-face")
async def register_person_face(
    folder_name: str = Form(...),
    file: UploadFile = File(...),
):
    try:
        safe_folder = folder_name.strip().replace(" ", "_")
        person_folder = os.path.join(DATABASE_PATH, safe_folder)

        os.makedirs(person_folder, exist_ok=True)

        filename = file.filename or "rostro.jpg"
        file_path = os.path.join(person_folder, filename)

        content = await file.read()

        with open(file_path, "wb") as f:
            f.write(content)

        return {
            "success": True,
            "message": "Imagen registrada correctamente",
            "folder": safe_folder,
            "file_path": file_path,
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
        }