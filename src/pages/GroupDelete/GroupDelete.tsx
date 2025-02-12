import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import useGroups from '../../contexts/useGroups';
import { AppError } from '../../utils/errors';

/**
 * `GroupDelete` コンポーネント
 * グループの削除画面。
 * @returns {null} グループの削除画面の UI を返す。
 */
const GroupDelete = (): null => {
  const { id } = useParams<{ id: string }>();
  const { handleDeleteGroup } = useGroups();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<boolean>(true);

  useEffect(() => {
    if (!id || !handleDeleteGroup) {
      navigate('/');
      return;
    }

    const deleteGroupAndNavigate = async (): Promise<void> => {
      try {
        await handleDeleteGroup(id);
        setIsDeleting(false); // 削除成功後に isDeleting を false に
        navigate('/');
        alert('削除しました');
      } catch (error) {
        throw new AppError(
          `Group with ID ${id} not found${(error as Error).message}`,
          404
        );
      }
    };

    deleteGroupAndNavigate();
  }, [id, handleDeleteGroup, navigate, isDeleting]);

  return null;
};

export default GroupDelete;
