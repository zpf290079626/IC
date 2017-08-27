package dao.login;

import org.apache.ibatis.annotations.Param;

import domain.login.PortalUserDomain;

public interface LoginUserMapper {

	/**
	 * 查看用户是否存在
	 * @param userId
	 * @return
	 */
	PortalUserDomain findUserByUserId(@Param("userId")String userId);
	
	/**
	 * 验证密码是否正确
	 * @param userId
	 * @return
	 */
	PortalUserDomain findUserByUserIdAndPassword(@Param("userId")String userId, @Param("passWord")String passWord);
	
	int register(PortalUserDomain domain);
}
