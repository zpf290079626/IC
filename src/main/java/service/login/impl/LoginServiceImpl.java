package service.login.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dao.login.LoginUserMapper;
import domain.login.PortalUserDomain;
import domain.login.UserContext;
import domain.login.UserLoginVO;
import domain.login.UserRegisterDomain;
import service.login.ILoginService;
import utils.AESUtil;
import utils.DateUtil;
@Service("loginService")
public class LoginServiceImpl implements ILoginService {

	@Autowired
	private LoginUserMapper loginUserMapper;
	
	public UserContext login(UserLoginVO vo) {

		UserContext resutl = new UserContext();
		String userId = vo.getUserId();
		String password = AESUtil.encrpt(vo.getPassword());
		PortalUserDomain portalUserDomain = loginUserMapper.findUserByUserId(userId);
		if (null == portalUserDomain) { // userId不存在
			resutl.setLoginErrorMsg("userId不存在");
			return resutl;
		}
		portalUserDomain = loginUserMapper.findUserByUserIdAndPassword(userId, password);
		if (null == portalUserDomain) { // userId不存在
			resutl.setLoginErrorMsg("密码错误");
			return resutl;
		}else {
			resutl.setUserId(userId);
			resutl.setUserId(portalUserDomain.getUserName());
		}
		return resutl;
	}

	
	@Override
	public String register(UserRegisterDomain domain) {
		String errMsg = "";
		PortalUserDomain exist = loginUserMapper.findUserByUserId(domain.getUserId());
		
		if (null != exist) {
			errMsg = "userId:" + domain.getUserId() + "已被注册，请更换！";
			return errMsg;
		} else {
			PortalUserDomain portalUserDomain = new PortalUserDomain();
			
			portalUserDomain.setUserId(domain.getUserId());
			portalUserDomain.setUserPass(AESUtil.encrpt(domain.getPassword()));
			portalUserDomain.setUserName(domain.getUserName());
			portalUserDomain.setMobile(domain.getTel());
			portalUserDomain.setEmail(domain.getEmail());
			portalUserDomain.setStatus("1");
			portalUserDomain.setMtTime(DateUtil.getMachingCurrentTime());
			portalUserDomain.setValidDate(DateUtil.getMachingCurrentDate());
			
			int count = loginUserMapper.register(portalUserDomain);
			if (count != 1) {
				errMsg = "新增用户失败！";
			}
		}
		
		return errMsg;
	}

}
