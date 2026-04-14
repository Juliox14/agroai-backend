import mongoose, { Mongoose } from 'mongoose';
import crypto from 'crypto';

const logForenseSchema = new mongoose.Schema({
    evento: {
        type: String,
        required: true,
        enum: ['LOGIN', 'CREACION_USUARIO', 'ELIMINACION_REGISTRO', 'MODIFICACION_DATOS', 'EXPORTACION_INFORMACION', 'CAMBIO_CONFIGURACION']
    },
    resultado: {
        type: String,
        required: true,
        enum: ['EXITO', 'ERROR']
    },
    usuario_id: { type: String },
    ip_origen: { type: String, required: true },
    hash_evidencia: { type: String },
    detalles: { type: mongoose.Schema.Types.Mixed },
    timestamp_iso: { type: String, required: true },
    firma_digital: { type: String },
}, {
    timestamps: false,
    versionKey: false
}
);


logForenseSchema.pre('save', async function() {
    if (this.isNew) {
        const dataToHash = `${this.evento}|${this.resultado}|${this.usuario_id}|${this.timestamp_iso}`;
        this.firma_digital = crypto.createHash('sha256').update(dataToHash).digest('hex');
    }
});

export const LogForense = mongoose.model('LogForense', logForenseSchema);