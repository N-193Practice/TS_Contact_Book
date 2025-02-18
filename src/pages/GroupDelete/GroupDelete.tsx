import { useParams, useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';
import { useGroups } from '../../contexts/useGroups';

/**
 * `GroupDelete` コンポーネント
 * グループの削除画面。
 * @returns {null} グループの削除画面の UI を返す。
 */
const GroupDelete = (): null => {
  const { id } = useParams<{ id: string }>();
  const { handleDeleteGroup } = useGroups();
  const navigate = useNavigate();
  const hasDeleted = useRef(false);

  // 削除処理を実行する
  useEffect(() => {
    if (hasDeleted.current) return; // 2回目以降はスキップ
    hasDeleted.current = true;

    if (id && handleDeleteGroup) {
      handleDeleteGroup(id);
      alert('削除しました');
      navigate('/');
    } else {
      alert('削除するグループがありません');
      navigate('/error'); // エラーページにナビゲート
    }
  }, [id, handleDeleteGroup, navigate]);

  return null;
};

export default GroupDelete;
