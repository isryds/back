import React, { useEffect,useState,useRef } from 'react';
import { useNavigate} from 'react-router-dom';
import {getUserProfile,SignOut} from '@/apis/UserSign'
import {  useDispatch } from 'react-redux';
import {setIsAdmin,setToken} from '@/store/reducers'
import { Button, Modal } from 'antd';
import {changePwd} from '@/apis/UserSign'
import { log } from 'console';

interface UserItemsProps{
    userId?:number,
    username?:string,
    isAdmin?:number,
}

interface InputDataProps extends Object{
    old_password:string | undefined,
    new_password:string | undefined
}

export const UserCard:React.FC = ()=>{
    //用户（管理员）基本信息
    const [userItem,setUserItem] = useState<UserItemsProps>({})
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const oldInputRef = useRef<HTMLInputElement>(null)
    const newInputRef = useRef<HTMLInputElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        //获取新旧密码值
        let formdata:InputDataProps = {
            old_password:oldInputRef.current?.value,
            new_password:newInputRef.current?.value
        }

        if(formdata.old_password == formdata.new_password){
            alert('您的新旧密码一致，请重新输入一个新密码')
            return
        }
        
        const res = await changePwd(formdata)
        // console.log(res);
        if(res?.data.code === '200'){
            alert('密码修改成功')
            setIsModalOpen(false);
            Navigate('/')
        }else{
            alert('您的旧密码错误')
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //退出登录
    const handleSignOut = async () => {
        const res = await SignOut()
        if(res?.data.code === '200'){
            Navigate('/')
            localStorage.setItem('access_token','')
            dispatch(setToken(''))
            dispatch(setIsAdmin(0))
        }else{
            alert(res?.data.msg)
        }
    }


    useEffect(()=>{
        getUserProfile().then((res:any)=>{
        console.log(res.data.data)
        const {userResp} = res.data.data  
        setUserItem(userResp); // 更新状态
        dispatch(setIsAdmin(userResp.isAdmin))
        }).catch((error:Error)=>{
        console.log(error);  
        })
    },[])

    return (
        <>
            <div className='w-72 h-72 mr-4 py-5'>
                <ul className='block flex-col h-56 w-56'>
                    <li className='mb-2 py-4 px-4'>用户ID: {userItem.userId}</li>
                    <li className='mb-2 py-4 px-4'>昵称: {userItem.username}</li>
                    <li className='mb-2 py-4 px-4'>权限等级: {userItem.isAdmin}</li>
                </ul>         
                <div className='flex w-72'>
                    <button className='flex-1 border w-24 h-12 mr-4 rounded-lg bg-cyan-100 hover:bg-cyan-300' onClick={showModal}>修改密码</button>
                    <button className='flex-1 border w-24 h-12 mr-4 rounded-lg bg-cyan-100 hover:bg-cyan-300' onClick={handleSignOut}>退出登录</button>
                </div>          
            </div>
            <Modal title="重置密码" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className='flex flex-col h-56 w-[470px] mt-8'>
                    <input className='border mb-2 py-4 px-4' placeholder='请输入您的旧密码' ref={oldInputRef} />
                    <input className='border mb-2 py-4 px-4' placeholder='输入创建的新密码' ref={newInputRef} />
                </div>      
            </Modal>
        </> 
    )
}
