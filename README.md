# Favlinks
Un lugar self-hosted para links y marcadores, con la finalidad de que estén disponibles desde todos los navegadores que use. Simple CRUD de URLs que corre en Node.js y utiliza MySQL como base de datos.

# Características
- CRUD de URLs con título y descripción.
- Registro de usuarios.
- Login de usuarios.
- Almacenamiento de sesiones.

# Cómo desplegar su propia instancia
- `git clone (este repo)`
- `cd nodemysql-favlinks`
- `npm install`
- Ejectutar database/db.sql en su base de datos MySQL
- Configurar los detalles de acceso en src/keys.js
- `npm run dev`

# TODO
- Implementar medidas básicas de seguridad (xD).
- Guardar links cifrados en la DB.
- Añadir métodos de recuperación de contraseña y captcha en el signup.
- Añadir medidas anti-CSRF en los formularios.
- Añadir buscador y organización por grupos/carpetas.
- Añadir opción para exportar.

Pull requests e issues bienvenidos.
