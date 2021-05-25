import { Typography } from 'antd';
import './App.css';
import Demo from './Form';

function App() {
  return (
    <>
      <div className="App">
        <div className="shareblock"><Typography.Title level={1}>Estonian Social Tax and Salary Calculator</Typography.Title></div>
        <div className="shareblock"><Typography.Text style={{ marginBottom: '24px' }}>Easily count your employees’ salaries/wages and Estonian tax deductions. As a result estimate a tax-free net salary.</Typography.Text></div>
        <Demo />
      </div>
    </>
  );
}

export default App;
