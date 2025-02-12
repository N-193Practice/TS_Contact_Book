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

  // TODO:グループを削除する非同期処理の修正
  // TODO:MUIエラーの処理
  useEffect(() => {
    if (!id || !handleDeleteGroup) {
      navigate('/');
      return;
    }

    const deleteGroupAndNavigate = async () => {
      try {
        await handleDeleteGroup(id);
        if (isDeleting) {
          navigate('/');
        }
      } catch (error) {
        alert('削除するグループがありません');
        throw new AppError(
          `Group with ID ${id} not found:${(error as Error).message}`,
          404
        );
      }
    };

    deleteGroupAndNavigate();

    return () => {
      setIsDeleting(false); // クリーンアップ時にフラグを変更
    };
  }, [id, handleDeleteGroup, navigate, isDeleting]);

  return null;
};

export default GroupDelete;
