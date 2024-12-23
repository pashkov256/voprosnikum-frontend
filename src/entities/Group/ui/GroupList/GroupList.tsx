import {classNames} from 'shared/lib/classNames/classNames';
import cls from './GroupList.module.scss';
import Loader from "shared/ui/Loader/Loader";
import {Text, TextSize} from 'shared/ui/Text/Text'
import {useCreateGroupMutation, useGetGroupsQuery} from "entities/Group/model/slice/groupSlice";
import {Button, ButtonTheme} from "shared/ui/Button/Button";
import {Input} from "shared/ui/Input/Input";
import {GroupCard} from "entities/Group/ui/GroupCard/GroupCard";
import {useState} from "react";

interface GroupListProps {
    className?: string;
    haveCreateMode?: boolean;
}

export const GroupList = (props: GroupListProps) => {
    const {className,haveCreateMode=true} = props;
    const {data,isLoading,error,refetch} = useGetGroupsQuery()
    const [groupName, setGroupName] = useState("")
    const [createGroup,{isLoading : createGroupIsLoading}] = useCreateGroupMutation();
    console.log(data)
    const onCreateGroup = async (name:string) => {
        await createGroup(name)
        refetch();
    }
    console.log(groupName)
    return (
        <div className={classNames(cls.GroupBlock, {}, [className])}>
            {haveCreateMode && <div className={cls.groupForm}>
                <Input className={cls.input} placeholder={"Название группы"} value={groupName} onChange={(fullName)=>setGroupName(fullName)}/>
                <Button
                    theme={ButtonTheme.BACKGROUND}
                    className={cls.ButtonGroupCreate}
                    onClick={()=>{
                        if(groupName === ""){
                            alert('Введите название группы!!!')
                        }else {
                            onCreateGroup(groupName)
                        }
                    }}
                >
                    Добавить
                </Button>
            </div>}
            {isLoading ? <Loader/> : data ? (
              <div className={cls.groupList}>
                  {data.map((group) => (
                      <GroupCard name={group.name} _id={group._id} key={group._id}/>
                  ))}
              </div>
            ) : (
                <div>Нет доступных групп</div>
            ) }

        </div>
    )

};
