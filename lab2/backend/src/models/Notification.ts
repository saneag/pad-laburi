import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        default: '',
        required: true,
    },
});

export default mongoose.model('Notification', NotificationSchema);
