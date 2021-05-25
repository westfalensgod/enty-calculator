import { Typography } from 'antd';
import './App.less';
import Demo from './Form';

function App() {
  return (
    <>
      <div className="App">
        <div className="shareblock"><Typography.Title level={1}>Estonian Social Tax and Salary Calculator</Typography.Title></div>
        <div className="shareblock"><Typography.Text style={{ marginBottom: '48px' }}>Easily count your employees’ salaries/wages and Estonian tax deductions. As a result estimate a tax-free net salary.</Typography.Text></div>
        <Demo />
        <Typography.Text style={{ display: 'block', marginTop: '16px' }}>Doesn't work properly? Please, <Typography.Link href="mailto:yw@enty.io">let us know</Typography.Link>!</Typography.Text>
      </div>
    </>
  );
}

export default App;
