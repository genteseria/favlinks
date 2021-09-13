const { readFile, writeFile } = require('fs');
const { Keyring, SymmetricKey } = require('dhole-crypto');
const { join } = require('path');

module.exports = new Promise((resolve, reject) => {
    const strPath = join(__dirname, '..', '..', 'key', 'symDBpwKey');

    let ring = new Keyring();

    readFile(strPath, 'utf8', async (err, data) => {
        if (err) {
            if (err.code == 'ENOENT'){
                    //Generando clave simétrica
                    const claveSimetrica = await SymmetricKey.generate();
                    // Convirtiendo clave simétrica a String
                    newKeyString = await ring.save(claveSimetrica);

                    writeFile(strPath, newKeyString, function(err) {
                        if(err) {
                            warning = "ADVERTENCIA: No se pudo guardar la string de la clave simétrica.\n";
                            warning += "Asegúrese de guardarla en el archivo symDBpwKey dentro del directorio key.\n";
                            warning += "(o en un lugar más seguro).\n"
                            warning += "A continuación se mostrará por única vez.\n";
                            warning += "Clave: " + newKeyString;
                            console.log(warning);
                        } else {
                            console.log("Clave simétrica generada y guardada.");
                        }
                    });

                    resolve(claveSimetrica);
            }
        } else {
            resolve(await ring.load(data));
            console.log("Clave simétrica leída desde el fichero predeterminado.")
        }
    });
});