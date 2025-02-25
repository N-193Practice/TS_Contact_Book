import { NavLink, useLoaderData, useSubmit } from 'react-router';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import styles from './Groups.module.css';
import { Group } from '../../models/types';

function Groups() {
  const groups = useLoaderData<Group[]>();

  const submit = useSubmit();

  const handleDelete = (id: string) => {
    submit(null, { method: 'delete', action: `/groups/delete/${id}` });
  };

  return (
    <>
      <List className={styles.list}>
        {groups.map((group) => (
          <ListItem
            key={group.id}
            disableGutters
            className={styles.listItem}
            secondaryAction={
              <div className={styles.actions}>
                <IconButton
                  aria-label=""
                  component={NavLink}
                  to={`/groups/edit/${group.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label=""
                  onClick={() => handleDelete(group.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            }
          >
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>
      <IconButton
        aria-label="新規作成"
        className={styles.addButton}
        component={NavLink}
        to={'/groups/new'}
      >
        <AddIcon className={styles.addIcon} />
      </IconButton>
    </>
  );
}

export default Groups;
