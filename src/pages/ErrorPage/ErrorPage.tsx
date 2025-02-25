import { useRouteError, isRouteErrorResponse, NavLink } from 'react-router';

import styles from './ErrorPage.module.css';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ApplicationHeader from '../../components/ApplicationHeader/ApplicationHeader';

function ErrorPage() {
  const routeError = useRouteError();

  let status: string = 'Error';
  let errorMessage: string;
  if (isRouteErrorResponse(routeError)) {
    // error is type `ErrorResponse`
    errorMessage = routeError.statusText;
    status = routeError.status?.toString();
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  } else if (typeof routeError === 'string') {
    errorMessage = routeError;
  } else {
    console.error(routeError);
    errorMessage = 'Unknown error';
  }

  return (
    <>
      <div className={styles.container}>
        <ApplicationHeader />
        <main className={styles.main}>
          <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  {status}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  {errorMessage}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={NavLink} to="/">
                  Back
                </Button>
              </CardActions>
            </Card>
          </Box>
        </main>
      </div>
    </>
  );
}

export default ErrorPage;
