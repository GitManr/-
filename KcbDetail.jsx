import React from 'react';
import { connect } from 'react-redux';
import { Header, Modal, TopicNode, ResultModal } from '../public';
import { actionType as mainSaga } from '../../models/sagas/main.saga';
import { actionType } from '../../models/sagas/answer.saga';
import styles from './kcbDetail.css';

const cyImg = require('../../assets/images/bg.png');

class KcbDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      details: null,
      topicList: props.topicList,
      currTopic: null,
      currTopicIndex: null,
      selectedMap: {},
      resultVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch, match: { params: { chapterId } } } = this.props;
    dispatch({
      type: mainSaga.getDetails,
      payload: {
        chapterId,
      },
    });
  }

  static getDerivedStateFromProps(newProps, preState) {
    if (newProps.details && JSON.stringify(newProps.details) !== '{}' && newProps.details !== preState.details) {
      newProps.dispatch({
        type: actionType.getTopicList,
        payload: { id: newProps.details.questionPackageId },
      });
      return { details: newProps.details };
    }
    if (newProps.topicList && newProps.topicList !== preState.topicList
      && newProps.topicList.length > 0) {
      return {
        currTopic: newProps.topicList[0],
        currTopicIndex: 1,
        topicList: newProps.topicList,
      };
    }
    return null;
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: mainSaga.clearDetails,
    });
  }


  goBackFunc = () => {
    window.history.go(-1);
  }
  preClick = () => {
    const { currTopicIndex, topicList } = this.state;
    if (currTopicIndex !== 1) {
      this.setState({
        currTopic: topicList[currTopicIndex - 2],
        currTopicIndex: currTopicIndex - 1,
      });
    }
  }
  nextClick = (data) => {
    const { currTopicIndex, topicList, currTopic } = this.state;
    const selectedMap = { ...this.state.selectedMap };
    selectedMap[currTopic.id] = data;
    if (topicList.length !== currTopicIndex) {
      this.setState({
        currTopic: topicList[currTopicIndex],
        currTopicIndex: currTopicIndex + 1,
        selectedMap,
      });
    } else {
      this.setState({
        selectedMap: {},
        resultVisible: true,
        visible: false,
        currTopic: topicList[0],
        currTopicIndex: 1,
      });
    }
  }
  render() {
    const {
      currTopic, selectedMap, currTopicIndex, topicList, visible, resultVisible,
    } = this.state;
    const { details, loading } = this.props;
    const isSingle = currTopic && currTopic.choiceList && currTopic.choiceList.length &&
      currTopic.choiceList.filter(item => item.result);
    return (
      <div className={styles.main}>
        <div>
          <Header
            title="科创板"
            clickFunc={() => this.goBackFunc()}
            className={styles.mainHeader}
            ref={(header) => { this.header = header; }}
          />
        </div>
        <section className={styles.section} >
          <div className={visible ? styles.sectionBoxH : styles.sectionBox}>
            <div className={styles.sectionBoxBg}>
              <div className={styles.html}>
                <div dangerouslySetInnerHTML={{ __html: details.content }} />
              </div>
              <div className={styles.sectionFoot} hidden={loading}>
                <img className={styles.cyImg} src={cyImg} alt="测验背景" />
                <div className={styles.sectionFootBox}>
                  <div>来测一测自己是否掌握了本节课的知识吧！</div>
                  <button onClick={() => { this.setState({ visible: true }); }} className={styles.btn} type="button">课堂小测验</button>
                </div>
              </div>
              <div className={styles.foot} hidden={loading}>—— 科创板小课堂 ——</div>
            </div>
          </div>
        </section>
        <Modal
          title="课堂小测验"
          visible={visible}
          className={styles.modal_bg}
          onCancel={() => { this.setState({ visible: false }); }}
        >
          <div className={styles.answer_index}>
            {currTopic && `${currTopicIndex}/${topicList.length}`}
          </div>
          {currTopic &&
            <div className={styles.answer_type}>
              ({isSingle && isSingle.length > 1 ? '多选' : '单选'})
            </div>
          }
          <div className={styles.modal_box}>
            {currTopic &&
            <div className={styles.topic_box}>
              <TopicNode
                data={currTopic}
                nextClick={this.nextClick}
                preClick={this.preClick}
                selected={selectedMap[currTopic.id]}
                currIndex={currTopicIndex}
                total={topicList.length}
                fixed
              />
            </div>
          }
          </div>
        </Modal>
        <ResultModal
          className={styles.modal_bg}
          source={100}
          visible={resultVisible}
          onCancel={() => { this.setState({ resultVisible: false }); }}
        >
          <section className={styles.modal}>
            <div>恭喜您完成了</div>
            <div className={styles.modal_result}>
              <div>{details.name}</div>
              <div>{details.smallName}</div>
            </div>
            <div>课堂小测验</div>
            <div>请继续努力！</div>
            <p>科创之船  扬帆起航</p>
            <div onClick={() => { alert('该功能需与原生对接，暂未开发敬请期待～'); }} className={styles.modal_button}>分享</div>
          </section>
        </ResultModal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  details: state.main.details,
  topicList: state.answer.topicList,
  loading: state.answer.loading,
});
export default connect(mapStateToProps)(KcbDetail);
