import {Button, InputItem, List, Toast} from "antd-mobile";
import {toUrl} from "common/routers";
import LinkButton from "components/LinkButton";
import {RCForm} from "entity/common";
import {LoginRequest} from "entity/session";
import {RootState, RouterData} from "modules";
import thisModule from "modules/app/facade";
import {ModuleNames} from "modules/names";
import {createForm} from "rc-form";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends RCForm, DispatchProp {
  pathname: string;
  searchData: RouterData["searchData"];
}

class Component extends React.PureComponent<Props> {
  private onSubmit = () => {
    const {validateFields, getFieldError} = this.props.form;
    validateFields((errors, values: LoginRequest) => {
      if (!errors) {
        this.props.dispatch(thisModule.actions.login(values));
      } else {
        const errorField = Object.keys(errors)[0];
        const message = getFieldError(errorField).join(", ");
        Toast.info(message, 3);
      }
    });
  };

  public render() {
    const {
      pathname,
      searchData,
      dispatch,
      form: {getFieldProps},
    } = this.props;

    const usernameDecorator = getFieldProps("username", {
      initialValue: "",
      rules: [
        {
          required: true,
          message: "请输入用户名！",
        },
      ],
    });
    const passwordDecorator = getFieldProps("password", {
      initialValue: "",
      rules: [
        {
          required: true,
          message: "请输入密码！",
        },
      ],
    });
    const regUrl = toUrl(pathname, {...searchData, [ModuleNames.app]: {...searchData.app, showRegisterPop: true}});
    return (
      <div className="app-LoginPop">
        <List className="bd">
          <InputItem {...usernameDecorator} clear={true} placeholder="用户名" />
          <InputItem {...passwordDecorator} clear={true} placeholder="密码" type="password" />
        </List>
        <div className="ft">
          <Button type="primary" onClick={this.onSubmit}>
            登录
          </Button>
          <div className="links">
            <LinkButton href={regUrl} key="0" dispatch={dispatch}>
              + 注册新会员
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const {pathname} = state.router.location;
  return {
    pathname,
    searchData: state.router.searchData,
  };
};

export default connect(mapStateToProps)(createForm()(Component));
