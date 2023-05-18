import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { articleState, codeState, selectedLeafState } from '@/recoil/topic';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import authApi from '@/hooks/api/axios.authorization.instance';
import { GrFlagFill } from 'react-icons/gr';
import { loginModalState, userState } from '@/recoil/user';
import { CodeObject } from '@/recoil/topic';

interface Props {}

const queryTopicFn = async (body: any) => {
  try {
    const response = await authApi.post('topic/', body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const queryLeafFn = async (body: any) => {
  try {
    const response = await authApi.post('leaf/', body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const queryLeafEditFn = async (leafId:number|null, body: any) => {
  try {
    const response = await authApi.patch(`leaf/${leafId}`, body);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const Article = ({}: Props) => {
  const router = useRouter();
  const topicId = router.query.topicId;
  const [article, setArticle] = useRecoilState(articleState);
  const user = useRecoilValue(userState);
  const code = useRecoilValue(codeState);
  const setCode = useSetRecoilState(codeState)
  const selectedLeaf = useRecoilValue(selectedLeafState);
  const setIsOpen = useSetRecoilState(loginModalState);
  const [needHelp, setNeedHelp] = useState(false);
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      title: `${article.title}`,
      content: `${article.content}`,
    },
  });

  const mutateTopic = useMutation((body: any) => queryTopicFn(body), {
    onSuccess: (topicId) => {
      router.push(`/topics/${topicId}`);
    },
  });

  const mutateLeaf = useMutation((body: any) => queryLeafFn(body), {
    onSuccess: (topicId) => {
      router.push(`/topics/${topicId}`);
    },
  });

  const mutateLeafEdit = useMutation((body: any) => queryLeafEditFn(selectedLeaf.leaf_id, body), {
    onSuccess: (topicId) => {
      router.push(`/topics/${topicId}`);
    },
  });

  const EditLeaf = () => {
    const body = {
      ...watch(),
      codes:code,
    }
    mutateLeafEdit.mutate(body)
  }

  const onSubmit = (data: any) => {
    if (!user.isLoggedIn) {
      setIsOpen((prev) => !prev);
    }
    // 토픽 생성 (선택된 리프가 없는 경우)
    else if (!selectedLeaf.leaf_id) {
      const body = {
        ...data,
        codes: code,
        needHelp: needHelp,
      };
      mutateTopic.mutate(body);
    }
    // 리프 생성 (선택된 리프가 존재하는 경우)
    else {
      let modifiedCode = code.map(item=>{
        const {code_id, ...modifiedItem } = item
        return modifiedItem
      })
      const body = {
        ...data,
        codes: modifiedCode,
        parent_leaf_id: selectedLeaf.leaf_id,
        topic_id: topicId,
      };
      mutateLeaf.mutate(body);
    }
  };

  const handleInputChange = useCallback(
    (event: { target: { name: string; value: string } }) => {
      const { name, value } = event?.target;
      setArticle((prev) => ({ ...prev, [name]: value }));
    },
    [setArticle]
  );

  const userPrompt = article.content
  console.log(userPrompt)
  const servePromptMutation = useMutation(()=>authApi.post('user/gpt/call', {userPrompt}), {
    onSuccess:(data)=>{
      const rst = data.data.answer
      const convertedData = JSON.parse(rst)
      const gptCode = []

      for (const key in convertedData) {
        const value = convertedData[key]
        const codeForm = {
          code_id: null,
          language: key,
          content: value
        }
        gptCode.push(codeForm)
      }
      setCode(gptCode)
    }
  })

  const handleServePrompt = ()=>{
    servePromptMutation.mutate()
    // e.preventDefault()
  }

  return (
    <div className="flex p-4 bg-inherit h-1/2">
      <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="font-bold">
          Title :{' '}
          <span className="text-red-500">
            {errors.title?.type === 'required' && '제목을 입력하시길 바랍니다.'}
          </span>
        </div>
        <input
          className="h-8 max-w-md article-input"
          maxLength={100}
          {...register('title', { required: true, maxLength: 100 })}
          type="text"
          name="title"
          value={article.title}
          onChange={handleInputChange}
          placeholder="제목"
        />
        <div className="font-bold">Content :</div>
        <div className='h-full relative'>
        <textarea
          className="resize-none h-[93%] article-input"
          {...register('content')}
          name="content"
          value={article.content || ''}
          onChange={handleInputChange}
          placeholder="내용"
          />
          {!selectedLeaf.leaf_id &&
            <div>
            <img src='/images/icons/gptLogo.png'
            className='cursor-pointer transform hover:scale-110 hover:shadow-sm absolute -bottom-[3.8rem] md:right-5 md:bottom-8'
            onClick={handleServePrompt}
            />
            {/* <div></div> try! */}
          </div> 
          }
        </div>
        <div className="flex flex-row place-self-end gap-3">
          {!selectedLeaf.leaf_id && (
            <div
              className={`bamboo-button w-20 min-h-full flex justify-center items-center hover:bg-red-600 ${
                !needHelp ? 'bg-rose-300' : 'bg-rose-500 shadow-inner'
              }`}
              onClick={() => setNeedHelp((prev) => !prev)}
            >
              {!needHelp ? `Help!` : <GrFlagFill />}
            </div>
          )}
          { selectedLeaf.user_id === user.user_id &&
            <div 
              className="bamboo-button"
              onClick={()=>EditLeaf()}>
              Edit
            </div> }
          <button className="bamboo-button">
            {!selectedLeaf.leaf_id ? 'Submit' : 'Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};
