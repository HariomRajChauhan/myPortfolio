import Experience from '../components/Experience';
import Education from '../components/Education';
import PageTransition from '../components/PageTransition';

const ExperiencePage = () => (
  <PageTransition>
    <Experience />
    <Education />
  </PageTransition>
);

export default ExperiencePage;
