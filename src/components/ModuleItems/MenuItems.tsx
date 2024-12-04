//左侧导航栏表头
import {  MenuProps  } from 'antd';
import {
  UserOutlined,
  CommentOutlined,
  FileOutlined,
  FileSyncOutlined,
  SmileOutlined,
  InfoCircleOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];

type ExtendedMenuItemType = MenuItem & {
  path?: string;
};

type ExtendedMenuItem = Required<MenuProps>['items'][number] & {
  children?: ExtendedMenuItemType[];
};

const items: ExtendedMenuItem[]= [
    {
      key: 'sub1',
      label: '用户管理',
      icon: <UserOutlined />,
      children: [
        { key: '1', label: '用户基础信息',path:'/layout/usersbasic' },
        { key: '2', label: '用户群聊信息',path:'/layout/usersgroup' },
        { key: '3', label: '用户帖子信息',path:'/layout/uesrstiezi' },
      ],
    },
    {
      key: 'sub2',
      label: '群聊管理',
      icon: <CommentOutlined />,
    },
    {
      key: 'sub3',
      label: '聊天管理',
      icon: <CommentOutlined />,
    },
    {
      key: 'sub4',
      label: '公告管理',
      icon: <ScheduleOutlined />,
    },
    {
      key: 'sub5',
      label: '帖子管理',
      icon: <FileSyncOutlined />,
    },
    {
      key: 'sub6',
      label: '文件管理',
      icon: <FileOutlined />,
    },
    {
      key: 'sub7',
      label: '违规记录',
      icon: <InfoCircleOutlined />,
    },
    {
      key: 'sub8',
      label: '举报反馈',
      icon: <SmileOutlined />,
    },
  ];

export default items