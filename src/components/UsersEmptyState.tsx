import EmptyState from './EmptyState';
import { FaUserAltSlash } from "react-icons/fa";

const UsersEmptyState = () => {
  return (
    <EmptyState
      icon={<FaUserAltSlash className="w-10 h-10" />}
      title="No se encontraron usuarios"
      description="Intenta ajustar tu búsqueda o agregar un nuevo usuario."
    />
  );
};

export default UsersEmptyState; 