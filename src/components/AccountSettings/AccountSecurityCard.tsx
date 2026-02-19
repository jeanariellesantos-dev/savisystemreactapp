import { useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { UserService } from "../../services/userService";

export default function AccountSecurityCard() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Security
      </h4>

      <div className="space-y-4">
        <SettingRow
          title="Password"
          description="Change your account password"
          action={
            <Button size="sm" onClick={() => setPasswordOpen(true)}>
              Change Password
            </Button>
          }
        />

        <SettingRow
          title="Email Address"
          description="Update your login email"
          action={
            <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
              Update
            </Button>
          }
        />
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />

      <UpdateEmailModal
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
      />
    </div>
  );
}
function SettingRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await UserService.changePassword(form);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h4 className="text-xl font-semibold mb-4 dark:text-white/90">
          Change Password
        </h4>

        <div className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              name="current_password"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              name="password"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="password_confirmation"
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Update Password"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
function UpdateEmailModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(
    localStorage.getItem("email") || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await UserService.updateEmail({ email });

      localStorage.setItem("email", data.email);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Email update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h4 className="text-xl font-semibold mb-4 dark:text-white/90">
          Update Email
        </h4>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <div>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Update Email"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

