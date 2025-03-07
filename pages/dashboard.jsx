import Head from 'next/head';
import PLCDataDisplay from '../components/PLCDataDisplay';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | PLC Monitoring System</title>
        <meta name="description" content="Real-time PLC data monitoring dashboard" />
      </Head>
      
      <PLCDataDisplay />
    </>
  );
}