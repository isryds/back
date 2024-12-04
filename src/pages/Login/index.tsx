import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import {SignIn} from '@/apis/UserSign'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/reducers'
import {useState} from 'react'
import csustplant from '../../assets/csustplant.png';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
type InputStatus = 'success'|'warning'| 'error'| 'validating'

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default function LoginPage(){

  const Navigate = useNavigate()
  const dispatch = useDispatch()

  const [inputStatus,setInputStatus] = useState<InputStatus>()

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    // console.log('Success:', values);
    let res = await SignIn(values)
    console.log(res);
    if(res.data.code === '400'){
      setInputStatus('error')
      alert(res.data.msg)
    }else if(res.data.code === '500'){
      setInputStatus('error')
      alert(res.data.msg)
    }else{
      const access_token = res.data?.data.access_token
      if(!localStorage.getItem('access_token') || localStorage.getItem('access_token') !== access_token){
        localStorage.setItem('access_token',access_token)
        dispatch(setToken(access_token))
      }
      Navigate('/layout/usersbasic')
    }
    
  }

    return (
      <>
        <div className="flex h-screen min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src={csustplant}
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              长理星球后台管理系统
            </h2>
          </div>
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 320 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="账号"
                  name="username"
                  validateStatus={inputStatus}
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="密码"
                  name="password"
                  validateStatus={inputStatus}
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit" className='relative left-14'>
                    登录
                  </Button>
                </Form.Item>
              </Form>
          </div>
        </div>
      </>
    )
}