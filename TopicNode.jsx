
import React, { useState, useEffect, useRef, mome } from 'react';
import styles from './topicNode.css';

import { numberToChinese } from '../../utils/tool';

const TopicNode = mome(
  ({
    data, nextClick, preClick, currIndex, selected, total, source, showTitle = true,
    fixed = false,
  }) => {
    const [selectedArr, setSelected] = useState([]); // 选中项
    const [isLock, setLock] = useState(false);// 是否锁定结果
    const [isSingle, setTopicType] = useState(true); // 是否为单选
    const topicContentRef = useRef(null);
    const onSelect = (index) => {
      if (isLock) return;
      if (isSingle) {
        setSelected([index]);
      } else {
        let newArr = [...selectedArr];
        if (selectedArr.includes(index)) {
          newArr = newArr.filter(item => item !== index);
        } else {
          newArr.push(index);
        }
        setSelected(newArr);
      }
    };
    const sumbit = () => {
      if (isLock) {
        setSelected([]);
        nextClick(selectedArr);
        setLock(selected && selected !== undefined);
      } else if (selectedArr && selectedArr.length > 0) {
        setLock(true);
        nextClick(selectedArr, true);
      }
    };
    useEffect(() => {
      if (data && data.choiceList && data.choiceList.length > 0) {
        const IsSingle = data.choiceList.filter(item => item.result).length === 1;
        setTopicType(IsSingle);
      }
      topicContentRef.current.scrollTop = 0;
    }, [data]);
    useEffect(() => {
      setSelected(selected || []);
      setLock(selected && selected !== undefined);
    }, [selected]);
    const isEnd = source ? '完成' : '提交';
    const isLastTopic = currIndex >= total ? isEnd : '下一题';

    return (
      <div className={styles.topic_node}>
        {showTitle &&
          <div className={styles.topic_index}>第{numberToChinese(parseInt(currIndex, 10))}题:</div>
        }
        <div className={styles.topic_box} style={showTitle ? {} : { paddingTop: 0 }}>
          <div
            className={fixed ? styles.topic_contentF : styles.topic_content}
            ref={topicContentRef}
          >
            <div className={fixed ? styles.contentAuto : ''} style={{ height: '100%' }}>
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content }} />
              {data.choiceList.map((item, index) =>
                (<ChoseItem
                  key={index}
                  data={item}
                  onSelected={onSelect}
                  index={index}
                  selected={selectedArr.includes(index)}
                  isLock={isLock}
                />),
              )}
              {isLock && <div className={styles.resolve}>{(`解析：${data.resolve}`)}</div>}
            </div>

            <section className={fixed ? styles.botton_sectionF : styles.botton_section}>
              <div className={styles.button_box}>
                <div className={`${styles.boutton_disabled} ${currIndex !== 1 ? styles.pre_button : ''} `} onClick={() => { if (currIndex !== 1) preClick(); }}>上一题</div>
                <div className={`${styles.button_sure} ${selectedArr.length === 0 ? styles.boutton_disabled : ''}`} onClick={sumbit}>{isLock ? isLastTopic : '提交'}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };
)
export default TopicNode;

const chooseIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ChoseItem = mome(
  ({
    data, onSelected, index, selected, isLock,
  }) => {
    const classNames = [styles.choose];
    if (selected) classNames.push(styles.choose_selected);
    if (isLock && selected && !data.result) classNames.push(styles.selected_false);
    if (isLock && data.result) classNames.push(styles.selected_true);
    return (
      <div className={classNames.join(' ')} onClick={() => { onSelected(index); }}>
        {`${chooseIndex[index]}.  ${data.answer}`}
      </div>
    );
  },
);

