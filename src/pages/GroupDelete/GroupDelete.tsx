import { useParams, useNavigate } from 'react-router';
import { useEffect } from 'react';
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

  // TODO:削除の処理修正
  useEffect(() => {
    if (!id || !handleDeleteGroup) {
      navigate('/');
      return;
    }

    const deleteGroupAndNavigate = async (): Promise<void> => {
      try {
        await handleDeleteGroup(id);
        navigate('/');
        alert('削除しました');
        return;
      } catch (error) {
        navigate('/');
        throw new AppError(
          `Error saving groups to localStorage: ${(error as Error).message}`,
          500
        );
      }
    };

    deleteGroupAndNavigate();
  }, [id, handleDeleteGroup, navigate]);

  return null;
};

export default GroupDelete;
