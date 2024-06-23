// import express from 'express'
// import { addKeyword, createBot, createFlow, createProvider, MemoryDB } from "@bot-whatsapp/bot";
// import { BaileysProvider } from "@bot-whatsapp/provider-baileys";


// const flowBienvenida = addKeyword('Hola').addAnswer('Buenas nueva prueba')

// const app = express()
// const main = async () => {

//     const provider = createProvider(BaileysProvider)

//     /**
//      * Enviar mensaje con metodos propios del provider del bot
//      */
//     app.post('/send-message-bot', async (req, res) => {
//         await provider.sendText('52XXXXXXXXX@c.us', 'Mensaje desde API')
//         res.send({ data: 'enviado!' })
//     })

//     await createBot({
//         flow: createFlow([flowBienvenida]),
//         database: new MemoryDB(),
//         provider
//     })
// }
// main()


import express from 'express';
import { createBot, createFlow, createProvider, MemoryDB, addKeyword } from "@bot-whatsapp/bot";
import { BaileysProvider } from "@bot-whatsapp/provider-baileys";

const app = express();

const main = async () => {
    const provider = createProvider(BaileysProvider);

    // Definir el flujo del bot (aquí solo tienes un flujo de bienvenida estático)
    const flowBienvenida = addKeyword('Hola').addAnswer('Buenas nueva prueba');
    const botFlow = createFlow([flowBienvenida]);

    // Endpoint GET para enviar mensajes personalizados
    app.get('/enviar-whatsapp-mensaje', async (req, res) => {
        const { celular, mensaje } = req.query; // Recibimos el número y el mensaje desde la URL

        try {
            await provider.sendText(`${celular}@c.us`, mensaje); // Enviar el mensaje al número especificado
            res.send({ status: 'success', message: 'Mensaje enviado!' });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al enviar el mensaje', error: error.message });
        }
    });

    // Iniciar el bot
    await createBot({
        flow: botFlow,
        database: new MemoryDB(),
        provider
    });

    // Iniciar el servidor Express
    const PORT = 4003; // Puerto en el que se ejecutará el servidor Express
    app.listen(PORT, () => {
        console.log(`Servidor Express iniciado en el puerto ${PORT}`);
    });
};

main();

