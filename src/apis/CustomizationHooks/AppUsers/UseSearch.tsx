import { useState,useEffect } from "react";
import {getAllAppUsersProfiles} from '@/apis/Handle'
import {AllUserResp} from '@/utils/ModuleProps/AppUsersItemsProps'
import {AppUserProps} from '@/apis/Handle'
import {searchAppUserProfilesWithId,searchUserProfilesWithOther} from '@/apis/Handle'
interface NewUserResp extends AllUserResp{
    key:string
}

type SearchTypeProps = 'idSearch' | 'otherSearch'
type InputPlaceholder = '请输入用户Id' | '请输入用户名，并在右侧选择参数项'
type LevelProps = 0 | 1 | 2 | ''
type isDeletedProps = 0 | 1 | ''
type isBannedProps = 0 | 1 | ''
export function useAppUsersSearch(handleResponse:Function,HandleGetProfiles:Function){
    const [searchType,setSearchType] = useState<SearchTypeProps>('otherSearch')
    const [level,setLevel] = useState<LevelProps>('')
    const [isDeleted,setIsDeleted] = useState<isDeletedProps>('')
    const [isBanned,setIsBanned] = useState<isBannedProps>('')
    const [paramsObj,setParamsObj] = useState<AppUserProps>({
        page:1,
        pageSize:8
    })
    const [placeholder,setPlaceholder] = useState<InputPlaceholder>('请输入用户名，并在右侧选择参数项')
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isSearch,setIsSearch] = useState<boolean>(false)
    
    // 防抖函数
    const debounce = (func: Function, delay: number) => {
        return (...args: any[]) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            func(...args);
        }, delay);
        setDebounceTimeout(timeout);
        };
    };

    const changeSearchType = (type:SearchTypeProps)=>{
        setSearchType(type)
        type === 'idSearch' ? setPlaceholder('请输入用户Id') : setPlaceholder('请输入用户名，并在右侧选择参数项')
    }

    const changeLevel = (type:LevelProps)=>{
        setLevel(type)
    }

    const changeIsDeleted= (type:isDeletedProps)=>{
    setIsDeleted(type)
    }
    
    const changeIsBanned = (type:isBannedProps)=>{
    setIsBanned(type)
    }
    const changePage = (page:number)=>{
        setParamsObj({
          ...paramsObj,
          page:page
        })
        setIsSearch(true)
      }
    
      const changePageSize = (pageSize:any)=>{
        setParamsObj({
          ...paramsObj,
          pageSize:pageSize
        })
      }
    const SearchAppUser = async (e: string) => {
        if (!e && level ==='' && isDeleted ==='' && isBanned ==='') {
          console.log('kong');
          HandleGetProfiles();
          setParamsObj({
            page:paramsObj.page,
            pageSize:paramsObj.pageSize,
          })
          return;
        }
        if (searchType === 'idSearch') {
          try {
            const res = await searchAppUserProfilesWithId(e);
            handleResponse(res);
          } catch (error) {
            console.log('idSearch', error);
          }
        } else if (searchType === 'otherSearch') {
          console.log(level);
          const paramsObject:AppUserProps = {
            page:paramsObj.page,
            pageSize:paramsObj.pageSize,
            username: e,
            ...(level !== '' ? {isAdmin:level} :{}),       
            ...(isDeleted !== '' ? {isDeleted:isDeleted} :{}),       
            ...(isBanned !== '' ? {isBanned:isBanned} :{}),  
          }
          setParamsObj(paramsObject);
          setIsSearch(true)
        }
      };
    
      const debouncedSearchAppUser = debounce(SearchAppUser, 1000);
      //多参数请求
      useEffect(() => {
        if (searchType === 'otherSearch' && isSearch === true) {
          const search = async () => {
            try {
              const res = await searchUserProfilesWithOther(paramsObj);
              handleResponse(res);
            } catch (error) {
              console.log('otherSearch', error); 
            }
          };
      
          search();
        }
        return ()=>{
          setIsSearch(false)
        }
      }, [isSearch]);

      return {
        searchType,
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
      }
}