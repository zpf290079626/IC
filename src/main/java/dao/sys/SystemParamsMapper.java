package dao.sys;


import java.util.List;
import org.apache.ibatis.annotations.Param;

import domain.common.SystemParamDomain;

public interface SystemParamsMapper {

	List<SystemParamDomain> selectByExample(@Param("systemParam")SystemParamDomain systemParam);
	
	List<SystemParamDomain> selectAllData();

	int insert(@Param("systemParam")SystemParamDomain systemParam);

	int updateByPrimaryKey(@Param("systemParam")SystemParamDomain systemParam);

	int deleteByPrimaryKey(String paramId);
	
	String selectByParamName(@Param("paramName")String paramName);

}