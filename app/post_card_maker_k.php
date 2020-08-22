<?php 
session_start();
$csrf_token = md5(uniqid(rand(),1)); // CSRFトークン
$_SESSION['csrf_token'] = $csrf_token;
?>

<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="google" content="notranslate" />
   	<meta http-equiv="X-UA-Compatible" content="IE=edge">
   	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>ポストカードメーカーK | ワクガンス</title>
	<link rel='shortcut icon' href='/home/images/favicon.ico' />
	
	<link href="/note_prg/css/bootstrap.min.css" rel="stylesheet">
	<link href="/note_prg/css/common2.css" rel="stylesheet">
	<link href="css/post_card_maker_k.css" rel="stylesheet">
	
	<script src="/note_prg/js/jquery3.js"></script>	<!-- jquery-3.3.1.min.js -->
	<script src="/note_prg/js/bootstrap.min.js"></script>
	<script src="/note_prg/js/vue.min.js"></script>
	<script src="js/jquery.qrcode.min.js"></script>
	
	<script src="js/PostCardMakerK.js?v=1.0.0"></script>
	<script src="js/post_card_maker_k.js?v=1.0.0"></script>

</head>
<body>
<div id="main">
<div id="header" ><h1>ポストカードメーカーK | ワクガンス</h1></div>
<div id="app1" class="container">

<pre id="err_msg" class="text-danger" style="display:none"></pre>

<div v-if="info.new_flg==1">
	メールアドレスを入力してください。（メールアドレスでなくても可。）
	<input type="text" v-model="info.email" style="width:100%" placeholder="exsample@example.com" />
	<button class="btn btn-success" v-on:click="regMailaddr()" >次へ</button>
	メールアドレスを元にデータをデータベースに保存します。
	これにより別のパソコンや端末でも作成したデータの読み出しが可能になります。
</div>


<div v-if="info.new_flg==0">
<div id="config_div">
	
	<div v-if="info.edit_mode==1">
		<div>
			ポストカードサイズ⇒
			横<input type="number" v-model="ent.card_mm_w" style="width:60px" />cm × 
			縦<input type="number" v-model="ent.card_mm_h"  style="width:60px"/>cm
		</div>
		<div>
			<select v-model="info.active_data_index" v-on:change="changeSlot()">
				<option v-for="(value, i) in slots" v-bind:value="i">
					{{ value }}
				</option>
			</select>
			<input type="text" v-model="new_slot" />
			<button type="button" v-on:click="addSlots()" class="btn btn-primary btn-sm">追加</button>
		</div>
	</div>
	

	<div>
		サイズ調整
		<div style="width:200px;display:inline-block"><input type="range" v-model="ent.size_rate" min="1" max="10" step="0.1" v-on:change="blurSizeRate()" /></div>
	</div>
	

	<button type="button" v-if="info.edit_mode==1" v-on:click="configApply()" class="btn btn-success">適用</button>
	<button type="button" v-if="info.edit_mode==0" v-on:click="clickEditMode()" class="btn btn-primary">編集</button>
	<button type="button" v-if="info.edit_mode==0" onclick="printout()" class="btn btn-primary">印刷</button>
	<span>ユーザー：</span><span>{{info.email}}</span>
</div>


<!-- ポストカード -->
<div id="post_card" v-bind:class="info.post_card_class" style="border:solid 15px white;">
	
	<div id="l_div" style="">
		
		<div  class="blur" style="width:100%;height:auto;overflow: hidden;">
			<img id="img1" v-bind:src="ent.img_fn | filImgFn" style="width:100%;">
		</div>
		<div v-if="info.edit_mode==1" style="margin-bottom:4px;">
				画像を変更⇒
				<div style="display:inline-block"><input id="img_fn" type="file" name="img_fn" accept="image/*" onchange="changeImgFn(this)" /></div>
		</div>
		
		<div id="ent.midasi1" v-if="ent.midasi1 != '' ">{{ent.midasi1}}</div>
		<div><input type="text" v-if="info.edit_mode==1" v-model="ent.midasi1" style="width:100%" /></div>
		
		<div  v-if="ent.text1 != '' " style="white-space:pre-wrap; word-wrap:break-word;">{{ ent.text1 }}</div>
		<textarea v-model="ent.text1" v-if="info.edit_mode==1" style="width:100%;height:100px"></textarea>
		
		<!-- QRコードまわり -->
		<table style="width:100%"><tr>
			<td>
				<div id="qr_code"></div>
			</td>
			<td style="vertical-align:middle;text-align:right;color:#5a5a5a">
				<div style="margin-left:4px;display:inline-block;">{{ent.text4}}</div>
			</td>
		</tr></table>
		<div v-if="info.edit_mode==1" style="width:95%;border: solid 1px #0e8ada;padding:1%">
			QRコードのURL
			<textarea v-model="ent.qr_code_url" style="width:100%;height:100px"></textarea><br>
			QRコードサイズ
			<div style="width:100%;display:inline-block"><input type="range" v-model="ent.pr_code_size" min="80" max="200" step="1" v-on:change="changeQrCodeSize()" /></div>
			補足テキスト
			<textarea v-model="ent.text4" style="width:100%;height:100px"></textarea>
		</div>
		
	</div>
	<div id="r_div" >
		<div style="width:100%;hight:50%;">
			<div v-if="ent.midasi2 != '' "  id="ent.midasi2">{{ent.midasi2}}</div>
			<div><input type="text" v-if="info.edit_mode==1" v-model="ent.midasi2" style="width:100%" /></div>
			
			<div  v-if="ent.text2 != '' " style="white-space:pre-wrap; word-wrap:break-word;">{{ ent.text2 }}</div>
			<textarea v-model="ent.text2" v-if="info.edit_mode==1" style="width:100%;height:100px"></textarea>
			
			<div v-if="ent.midasi3 != '' "  id="ent.midasi3">{{ent.midasi3}}</div>
			<div><input type="text" v-if="info.edit_mode==1" v-model="ent.midasi3" style="width:100%" /></div>
			
			<div  v-if="ent.text3 != '' " style="white-space:pre-wrap; word-wrap:break-word;">{{ ent.text3 }}</div>
			<textarea v-model="ent.text3" v-if="info.edit_mode==1" style="width:100%;height:100px"></textarea>

		</div>
	</div>
	
</div><!-- new_flg -->
</div><!-- vue app -->


<input type="hidden" id="csrf_token" value="<?php echo $csrf_token;?>" />


<div class="yohaku"></div>
<ol class="breadcrumb">
	<li><a href="/">ホーム</a></li>
</ol>
</div><!-- content -->
<div id="footer">(C) kenji uehara 2020-8-9</div>
</div><!--  -->
<div id="print_div"></div>
</body>
<div id="printout"></div>
</html>