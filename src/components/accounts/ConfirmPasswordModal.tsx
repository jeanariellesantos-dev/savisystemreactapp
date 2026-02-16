import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmPasswordModal({
  isOpen,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-md">
      <div className="p-6 dark:bg-gray-900 rounded-3xl">
        <h3 className="text-lg font-semibold mb-4">
          Confirm Password Change
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          You are about to change this user's password.
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </Modal>
  );
}
