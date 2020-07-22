import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GetStaticProps } from 'next';
import { FaqModel } from '../../api/Faq';
import { openDB } from '../openDB';

const useStyles = makeStyles({
  root: {
    // background: 'linear-gradient( 135deg, #002661 10%, #92FFC0 100%)',
    background: 'linear-gradient(to left, #FFFDE4, #005AA7)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '0 30px',
  },
});

interface FaqProps {
  faq: FaqModel[];
}

export default function Faq({ faq }: FaqProps) {
  const classes = useStyles();

  return (
    <div>
      {faq.map((f) => (
        <Accordion key={f.id} className={classes.root}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{f.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{f.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await openDB();
  const faq = await db.all('SELECT * FROM FAQ ORDER BY createDate DESC');
  return {
    props: {
      faq,
    },
  };
};
