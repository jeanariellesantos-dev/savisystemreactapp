import { useModal } from "../../hooks/useModal";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  const employeeNumber = localStorage.getItem("employee_number") || "-";
  const firstName = localStorage.getItem("firstname") || "";
  const lastName = localStorage.getItem("lastname") || "";
  const roleDescription = localStorage.getItem("role_description") || "";

  return (
    <>
      <div className="p-6 transition-all bg-white border border-gray-200 shadow-sm rounded-2xl dark:bg-gray-900 dark:border-gray-800 hover:shadow-md">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* User Section */}
          <div className="flex items-center gap-5">
            
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-700">
                <img
                  src={`${import.meta.env.BASE_URL}images/user/owner.png`}
                  alt="User avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {firstName} {lastName}
              </h4>

              <p className="text-sm text-gray-500 dark:text-gray-400">
             {employeeNumber}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{roleDescription}</span>

                <span className="hidden md:block text-gray-300 dark:text-gray-700">•</span>

                <span>Manila, Philippines</span>
              </div>
            </div>
          </div>

          {/* Edit Button (kept functionality but cleaner design) */}
          {/* 
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 transition bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
              />
            </svg>
            Edit Profile
          </button>
          */}
        </div>
      </div>
    </>
  );
}