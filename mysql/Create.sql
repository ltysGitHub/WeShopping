create database `WeShopping` default character set utf8 COLLATE utf8_unicode_ci;
use `WeShopping`;

#创建用户：必要信息（手机号phone，昵称name，密码pw），后台自动生成唯一用户id，插入用户表，密码表
#用户登录：必要信息（手机号phone，密码pw），查询用户表，密码表
#新增商品：必要信息（店铺shop，商家seller，商品名name，剩余量rest，价格price），后台自动生成商品id，插入商品表
#删除商品：必要信息（商品id），查询权限并删除
#修改商品：必要信息（商品id），可修改信息（商品名name，剩余量rest，价格price，折扣discount，标签tag，类别class），查询并修改商品表
#商品补货：必要信息（商品id，补货量num），查询并修改商品表
#商品出货：必要信息（商品id，出货量num），查询并修改商品表
#商品打折：必要信息（商品id，折扣数discount），查询并修改商品表
#卖家开店：必要信息（卖家owner，店铺名name），查询并修改商店表
#创建订单：必要信息（商品goodid，货物数量num，买家buyer，卖家seller，地址addr，价格price，是否付款paid），查询并插入订单表
#确认订单：必要信息（订单id），查询并修改订单表
#确认发货：必要信息（订单id），查询并修改订单表
#确认收货：必要信息（订单id），查询并修改订单表
#查看订单：必要信息（订单id），查询订单表
#取消订单：必要信息（订单id），查询并修改订单表


#用户表，存储用户基本信息
create table `users`(
	id 			 varchar(50) not null,				#用户id
	type		 char(1) default 'o',				#用户类型，‘o’：普通用户，‘s’：卖家，‘m’：管理员
	name		 varchar(100) not null,				#用户昵称
	sex			 char(1) default 'u',				#性别，‘u’：未知，‘f’：女，‘m’：男
	email		 varchar(200),						#用户邮箱
	phone		 varchar(20) not null,				#手机号
	primary key(id)
);

-- #商店表，存储商店信息
-- create table `shops`(
-- 	id 			 varchar(50) not null,				#商店id
-- 	owner		 varchar(50) not null,				#拥有者id
-- 	name		 varchar(100) not null,				#店铺名
-- 	foreign key(owner) references users(id),
-- 	primary key(id)
-- );

-- #商家申请表，存储用户申请成为商家的信息，用于审核
-- create table `sellerReq`(
-- 	userId		 varchar(50) primary key,			#申请用户的用户id
-- 	reqTime		 date,								#申请时间
-- 	status		 char(1),							#申请状态，‘u’未处理,'p'允许，‘o’拒绝
-- 	foreign key(userId) references users(id)
-- );

-- #店铺申请表，存储商家申请开店的信息，用于审核
-- create table `shopReq`(
-- 	sellerId	 varchar(50) primary key,			#申请商家的用户id
-- 	reqTime		 date,								#申请时间
-- 	status		 char(1),							#申请状态，‘u’未处理,'p'允许，‘o’拒绝
-- 	foreign key(sellerId) references users(id)
-- );

#商品表，存储商品信息
create table `goods`(
	id 			 varchar(50) not null,				#货物id
	-- shop 		 varchar(50) not null,				#商店id
	name		 varchar(100) not null,				#名称
	class		 varchar(230),						#类别,可以多个，以逗号分隔，单个长度不大于10，最多20个
	tag			 varchar(103),						#标签,可以多个，以逗号分隔，单个长度不大于20，最多5个
	rest		 int default 0,						#剩余数量
	saleVolume 	 int default 0,						#销量
	price		 double not null,					#价格
	seller		 varchar(50) not null,				#商家用户id
	discount	 float default 1.0,					#打折信息，默认不打折
	foreign key(seller) references users(id),
	-- foreign key(shop) references shops(id),
	primary key(id)
);

#密码表，存储用户密码信息
create table `pwd`(
	id 			 varchar(50) not null,				#用户id
	pw 			 varchar(100) not null,				#用户密码
	foreign key(id) references users(id)
);

#订单表，存储订单信息
create table `orders`(
	id 			 varchar(50) not null,				#订单号
	orderDate	 date not null,						#订单日期
	good		 varchar(50) not null,				#商品号
	num			 int not null,						#货物数量
	-- shop 		 varchar(50) not null,				#商店id
	class		 varchar(20),						#类型
	buyer		 varchar(50) not null,				#买家id
	seller 		 varchar(50) not null,				#卖家id
	addr		 varchar(300) not null,				#收货地址
	price 		 double not null,					#订单价格
	message		 varchar(200),						#留言
	status		 char(1) not null,					#订单状态，‘u’:商家未处理，‘c’：已取消，‘o’：已确认，‘g’：已发货，‘e’：已收货
	delivInfo	 varchar(300),						#发货信息
	primary key(id),
	foreign key(buyer) references users(id),
	foreign key(good) references goods(id),
	foreign key(seller) references users(id)
);