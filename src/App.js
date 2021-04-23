import { Typography } from 'antd';
import './App.css';
import Demo from './Form';

function App() {
  return (
    <>
      <div className="App">
        <div className="shareblock"><Typography.Title level={1}>Calculator</Typography.Title></div>
        <Demo />
      </div>
    </>
  );
}

export default App;
