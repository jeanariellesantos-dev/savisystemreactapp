import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  is_active: boolean;
};

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onToggle: (user: User) => void;
};

export default function AccountsTable({ users, onEdit, onToggle }: Props) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        {/* ================= HEADER ================= */}
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell isHeader className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
              Name
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
              Email
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
              Role
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
              Status
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
              Operation
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <TableRow key={user.id}>
              
              <TableCell className="py-3 text-theme-sm">
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {user.firstname} {user.lastname}
                </span>
              </TableCell>

              <TableCell className="py-3 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </TableCell>

              <TableCell className="py-3 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </TableCell>

              <TableCell className="py-3 text-center">
                <Badge
                  size="sm"
                  color={user.is_active ? "success" : "error"}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="py-3 text-center">
                <div className="flex justify-center items-center gap-2">

                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(user)}
                    className="
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      border border-gray-200
                      text-blue-600
                      hover:bg-blue-600 hover:text-white
                      dark:border-gray-700
                      transition
                    "
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                      />
                    </svg>
                  </button>

                  {/* TOGGLE STATUS BUTTON */}
                  <button
                    onClick={() => onToggle(user)}
                    className={`
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      border border-gray-200
                      dark:border-gray-700
                      transition
                      ${
                        user.is_active
                          ? "text-red-600 hover:bg-red-600 hover:text-white"
                          : "text-green-600 hover:bg-green-600 hover:text-white"
                      }
                    `}
                    title={user.is_active ? "Deactivate" : "Activate"}
                  >
                    {user.is_active ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE */}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-gray-500">
                No accounts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
