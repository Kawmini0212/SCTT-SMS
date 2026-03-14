import Modal from './Modal';

export default function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) {
    const footer = (
        <>
            <button onClick={onCancel} className="btn-outline">
                {cancelText}
            </button>
            <button onClick={onConfirm} className="btn-danger">
                {confirmText}
            </button>
        </>
    );

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title={title}
            footer={footer}
            maxWidth="max-w-md"
        >
            <p className="text-brand-gray3">{message}</p>
        </Modal>
    );
}
