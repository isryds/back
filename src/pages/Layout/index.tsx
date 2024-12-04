import React, { useState,Suspense } from 'react';
import { Outlet,useNavigate} from 'react-router-dom';
import items from '@/components/ModuleItems/MenuItems'
import {  Layout, Menu, theme,  Drawer,Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {UserCard} from '../UserCard'

const { Sider, Content,Header } = Layout;

const LayoutPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [open, setOpen] = useState(false);
  const Navigate = useNavigate()
  
  //控制右侧抽屉开关
  const showDrawer = () => {
    setOpen(true);   
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleMenuSelect = (e:any)=>{
    // console.log(items[e.keyPath[1].slice(3)- 1]?.children[e.keyPath[0]-1].path);
    Navigate(items[e.keyPath[1].slice(3)- 1]?.children[e.keyPath[0]-1].path)
  }

  return (
    <Layout className='h-screen'>
      <Sider className='bg-blue-300 pt-1'>
        <Menu
          theme="light"
          mode="inline"
          className='bg-blue-300 mt-2'
          defaultSelectedKeys={['sub1']}
          items={items}
          onSelect={handleMenuSelect}
        />
      </Sider>
      <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }} className='h-18 relative'>  
          <Avatar
            className='w-10 h-10 absolute right-8 top-4 hover:cursor-pointer'
            icon={<UserOutlined />}
            onClick={showDrawer}
          />
          <Drawer title="个人信息" onClose={onClose} open={open}>
            <UserCard/>
          </Drawer>
      </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Suspense fallback={<div>loading..</div>}>
              <Outlet/>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;