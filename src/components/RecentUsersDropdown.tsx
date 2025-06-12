import React, { useState, useRef, useEffect } from 'react';

interface RecentUser {
  id: string | number;
  name: string;
  email: string;
  created_at: string;
}

interface RecentUsersDropdownProps {
  users: RecentUser[];
}

export const RecentUsersDropdown: React.FC<RecentUsersDropdownProps> = ({ users }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!users || users.length === 0) return null;

  return (
    <div className="my-4 relative inline-block" ref={dropdownRef}>
      <button
        className="text-lg font-semibold mb-2 focus:outline-none flex items-center"
        onClick={() => setOpen((prev) => !prev)}
      >
        5 Usuarios Más Recientes
        <span className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div
        className={`absolute left-0 z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-72 transition-all duration-300 origin-top transform ${open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
        style={{ transformOrigin: 'top' }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={String(user.id)}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 