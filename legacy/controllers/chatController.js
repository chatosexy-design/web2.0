
/**
 * @desc    Enviar mensaje al asistente virtual
 * @route   POST /api/chat/message
 * @access  Público
 */
exports.chatMessage = async (req, res, next) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: 'El mensaje no puede estar vacío' });
    }

    try {
        let response = "";
        const msg = message.toLowerCase();

        // Lógica de intents básica (preparada para IA externa)
        if (msg.includes('nutrición') || msg.includes('comer') || msg.includes('dieta')) {
            response = "La nutrición es la clave para una vida saludable. Te sugiero usar nuestro analizador para ver el desglose de macronutrientes de tus comidas.";
        } else if (msg.includes('receta') || msg.includes('cocinar') || msg.includes('preparar')) {
            response = "Cocinar en casa es la mejor manera de controlar tu salud. Spoonacular nos ayuda a analizar tus ingredientes.";
        } else if (msg.includes('hola') || msg.includes('buenos días')) {
            response = "¡Hola! Soy tu asistente de Chato Sano. ¿En qué puedo ayudarte a mejorar tu alimentación hoy?";
        } else if (msg.includes('azúcar')) {
            response = "Reducir el consumo de azúcar procesada es un gran primer paso. La OMS recomienda menos de 25g al día.";
        } else {
            response = "Entiendo. Mi objetivo es ayudarte a tomar decisiones alimenticias más informadas. ¿Deseas analizar algún alimento?";
        }

        setTimeout(() => {
            res.status(200).json({
                success: true,
                response,
                timestamp: new Date().toISOString()
            });
        }, 500);

    } catch (error) {
        next(error);
    }
};
