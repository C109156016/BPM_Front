import React from 'react';
import { Space, Spin } from 'antd';
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <Space className="loading-space">
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </Space>
  );
};

export default LoadingScreen;
