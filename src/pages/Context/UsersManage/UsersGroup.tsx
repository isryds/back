import {UserProfileResp,AllUserResp} from '@/utils/ModuleProps/AppUsersItemsProps'
import {getAllAppUsersProfiles} from '@/apis/Handle'
import { useEffect,useState } from 'react'
import { Input,Select,InputNumber,Pagination } from 'antd';
import { useAppUsersSearch } from '@/apis/CustomizationHooks/AppUsers/UseSearch';
import type { ProColumns } from '@ant-design/pro-components';
import {EditableProTable} from '@ant-design/pro-components';
import {changeAppUserProfiles} from '@/apis/Handle/index'

interface NewUserResp extends AllUserResp{
  id:number
}

const { Option }  = Select
const { Search } = Input;

const columns: ProColumns<UserProfileResp>[] = [
  {
    title: 'userId',
    dataIndex:'userId',
    readonly: true,
  },
  {
    title: '头像',
    dataIndex:'avatarUrl',
    render: (_, { avatarUrl }) => (
      <>
        <img className='w-4 h-4' src={avatarUrl}/>
      </>
    ),
  },
  {
    title: '昵称',
    dataIndex:'bio',
  },
  {
    title: '用户等级',
    dataIndex:'userLevel',
  },
  {
    title: '性别',
    dataIndex:'gender',
  },
  {
    title: '学历',
    dataIndex:'grade',
  },
  {
    title: '生日',
    dataIndex:'birthDate',
  },
  {
    title: '位置',
    dataIndex:'location',
  },
  {
    title: '博客',
    dataIndex:'website',
  },
  {
    title: '是否删除',
    dataIndex:'isDeleted',
  },
  {
    title: '用户自述',
    dataIndex:'description',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 200,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>
    ],
  },
];

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default function UsersGroup(){
  const [newdata, setNewData] = useState<NewUserResp[]>([])
  const [allData, setAllData] = useState<AllUserResp[]>([])

  const HandleGetProfiles = async () => {
    const res = await getAllAppUsersProfiles(paramsObj.page, paramsObj.pageSize)
    if (res?.data?.data) {
      setAllData(res.data.data)
      const updatedData = res.data.data.map((item: AllUserResp, index: number) => {
        const newItem: NewUserResp = { 
          ...item.userProfileResp,
          id: index,
          isDeleted:item.userProfileResp.isDeleted === 1 ? '是' : '否',
          gender:item.userProfileResp.gender === 1 ? '男':'女',
          website:item.userProfileResp.website === null ? '无' : '有'
        } 
        return newItem
      })
      setNewData(updatedData)
    }
  }
  //UserProfileResp数据表响应数据处理
  const handleResponse = (res:any) =>{
    if(res?.data.code === '200'){
      console.log(res.data.data);
      if (res?.data?.data) {
        let resData = res.data.data
        //针对两种请求返回的不同类型data进行区分
        if(resData instanceof Array ){
          const resItem:NewUserResp[] = resData.map((item, index) => ({
            ...item.userProfileResp,
            id:index,
            isDeleted: item.userProfileResp.isDeleted === 1 ? '是' : '否',
            gender:item.userProfileResp.gender === 1 ? '男':'女',
            website:item.userProfileResp.website === null ? '无' : '有'
          }))
          setNewData(resItem)
        }else{
          const newItem = {
            ...resData.userProfileResp,
            isDeleted:resData.userProfileResp.isDeleted === 1 ? '是' : '否',
            gender:resData.userProfileResp.gender === 1 ? '男':'女',
            website:resData.userProfileResp.website === null ? '无' : '有'
          }
          setNewData([newItem])
        }
      }
    }else{
      alert(res?.msg)
      setNewData([])
    }
  }

  const {searchType,
    level,
    placeholder,
    isDeleted,
    isBanned,
    paramsObj,
    changeSearchType,
    debouncedSearchAppUser,
    changeLevel,
    changeIsDeleted,
    changeIsBanned,
    changePageSize,
    changePage,
  } = useAppUsersSearch(handleResponse,HandleGetProfiles)

  useEffect(()=>{
    HandleGetProfiles()
  },[])
  
  const saveChangeUsersProfiles = async (rowKey:any,data:any)=>{
    //处理发送body
    delete data.index
    delete data.id
    data.isDeleted = data.isDeleted === '是' ? 1 : 0
    data.gender = data.gender === '男' ? 1 : 0
    data.website = data.website === '无' ? null : data.website
    var userProfileResp = {
      ...(allData[rowKey].userProfileResp),
      ...data
    }
    var newAllDateObj = {
      ...allData[rowKey],
      userProfileResp
    }
    let bodyData:AllUserResp = {}
    Object.keys(newAllDateObj).forEach((item:string)=>{
      delete newAllDateObj[item]?.createTime
      delete newAllDateObj[item]?.updateTime
      bodyData[item] = {...newAllDateObj[item]}
    })
    const res = await changeAppUserProfiles(bodyData)
    if(res.status === '200'){     
      alert('修改成功')
      HandleGetProfiles()
    }
    
  }

  
  return (
      <>
        <div className='flex mb-4'>
            <Select defaultValue={searchType} style={{ width: 140 }} onChange={changeSearchType}>
              <Option value="idSearch" >idSearch</Option>
              <Option value="otherSearch" >otherSearch</Option>
            </Select>
            <Search
              placeholder={placeholder}
              onSearch={debouncedSearchAppUser}
              style={{ width: 300 }}
            />
            {searchType === 'otherSearch' ? 
            <>
              <h4 className='text-justify py-1 mr-2 ml-4'>权限等级:</h4>
              <Select defaultValue={level} style={{ width: 70 }} onChange={changeLevel}>
                <Option value="" >未选</Option>
                <Option value={0} >0</Option>
                <Option value={1} >1</Option>
                <Option value={2} >2</Option>
              </Select>
              <h4 className='text-justify py-1 mr-2 ml-4'>是否删除:</h4>
              <Select defaultValue={isDeleted} style={{ width: 70 }} onChange={changeIsDeleted}>
                <Option value="" >未选</Option>
                <Option value={1} >是</Option>
                <Option value={0} >否</Option>
              </Select>
              <h4 className='text-justify py-1 mr-2 ml-4'>是否封禁:</h4>
              <Select defaultValue={isBanned} style={{ width: 70 }} onChange={changeIsBanned}>
                <Option value="" >未选</Option>
                <Option value={1} >是</Option>
                <Option value={0} >否</Option>
              </Select>
              <h4 className='text-justify py-1 mr-2 ml-4'>条数:</h4>
              <InputNumber min={1} max={8} defaultValue={paramsObj.pageSize} style={{ width: 60 }} onChange={changePageSize} />
            </>
          : <></>
        }</div>
        <EditableProTable<UserProfileResp>
          rowKey="id"
          maxLength={5}
          columns={columns}
          request={async () => ({
            data: newdata,
            total: 3,
            success: true,
          })}
          value={newdata}
          onChange={()=>{console.log('数据修改了')}}
          editable={{
            type: 'multiple',
            onSave: async (rowKey, data) => {
              saveChangeUsersProfiles(rowKey,data)
              await waitTime(2000);
            },
          }}
        />
        {searchType === 'otherSearch' ? 
          <div className='mt-1'>
            <Pagination 
              align='center'
              defaultCurrent={paramsObj.page} 
              onChange={changePage}
              total={paramsObj.pageSize * 5}
              pageSize={paramsObj.pageSize}
            />
          </div>:<></>
        }
      </>
  )
}