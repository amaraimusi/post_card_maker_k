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
	<link href="css/post_card_maker_k.css?v=2.0.1" rel="stylesheet">
	
	<script src="/note_prg/js/jquery3.js"></script>	<!-- jquery-3.3.1.min.js -->
	<script src="/note_prg/js/bootstrap.min.js"></script>
	<script src="/note_prg/js/vue.min.js"></script>
	<script src="js/jquery.qrcode.min.js"></script>
	<script src="js/html2canvas.min.js"></script>
		
	<script src="js/PostCardMakerK.js?v=2.0.1"></script>
	<script src="js/post_card_maker_k.js?v=2.0.1"></script>

</head>
<body>
<div id="main">
<div id="header" ><h1>ポストカードメーカーK | ワクガンス</h1></div>
<div id="app1" class="container">

	<pre id="err_msg" class="text-danger" style="display:none"></pre>
	
	<div v-if="info.new_flg==1">
		メールアドレスを入力してください。（メールアドレスでなくても可。）
		<input id="email_text" type="text" v-model="info.email" style="width:100%" placeholder="exsample@example.com" autocomplete="on" />
		<button class="btn btn-success" v-on:click="regMailaddr()" >次へ</button>
		メールアドレスを元にデータをデータベースに保存します。
		これにより別のパソコンや端末でも作成したデータの読み出しが可能になります。
	</div>
	
	
	<div v-if="info.new_flg==0">
		<div id="config_div">
			<div v-if="info.edit_mode==1">
				<table style="width:100%"><tbody>
					<td>
						ポストカードサイズ⇒
						横<input type="number" v-model="ent.card_mm_w" style="width:60px" />cm × 
						縦<input type="number" v-model="ent.card_mm_h"  style="width:60px"/>cm
					</td>
					<td style="text-aligin:center">
						スロット選択（データ選択）：
						<select v-model="info.active_data_index" v-on:change="changeSlot()">
							<option v-for="(value, i) in slots" v-bind:value="i">
								{{ value }}
							</option>
						</select>
					</td>
					<td style="text-aligin:right">
						<button type="button" class="btn btn-default btn-sm" onclick="jQuery('#config_div2').toggle(300)">設定</button>
					</td>
				</tbody></table>
			</div>
			
			<div id="config_div2" style="padding:8px;margin:4px;background-color:#bfeeec;display:none">
				<table><tbody>
					<tr>
						<td>新しいスロット選択肢を追加</td>
						<td style="padding:left:4px;">
							<input type="text" v-model="new_slot" placeholder="-- スロット名（見出し1) --" />
							<button type="button" v-on:click="addSlots()" class="btn btn-primary btn-sm">追加</button>
						</td>
					</tr>
					<tr>
						<td><button type="button" v-on:click="clearLs()" class="btn btn-default btn-xs" title="ブラウザで保存しているキャッシュ（ローカルストレージ）をクリアする。">キャッシュクリア</button></td>
					</tr>
				</tbody></table>
			</div>
			
		
			<div>
				サイズ調整
				<div style="width:200px;display:inline-block"><input type="range" v-model="ent.size_rate" min="1" max="10" step="0.1" v-on:change="blurSizeRate()" /></div>
				<button type="button" v-if="save_btn2_flg==1" v-on:click="save2()" class="btn btn-success btn-sm">保存</button>
			</div>
			
		
			<button type="button" v-if="info.edit_mode==1" v-on:click="save()" class="btn btn-success">保存</button>
			<button type="button" v-if="info.edit_mode==0" v-on:click="clickEditMode()" class="btn btn-primary">編集</button>
			<span>ユーザー：</span><span>{{info.email}}</span>
			<button type="button" v-if="info.edit_mode==0" onclick="printPreview()" class="btn btn-primary btn-xs">印刷用画像プレビュー</button>
		</div><!-- config-div -->
		
		<!-- ポストカード -->
		<div id="post_card" v-bind:class="info.post_card_class" style="border:solid 15px white;display:inline-block">
			
			<div id="l_div" style="">
				

				<div  class="blur_bk" style="width:100%;height:auto;overflow: hidden;">
					<img id="img1" v-bind:src="ent.img_fn | filImgFn" style="width:100%;">
				</div>
				<div v-if="info.edit_mode==1" style="margin-bottom:4px;">
						画像を変更⇒
						<div style="display:inline-block"><input id="img_fn" type="file" name="img_fn" accept="image/*" onchange="changeImgFn(this)" /></div>
				</div>
				
				<div id="ent.midasi1" v-if="ent.midasi1 != '' " class="midasi">{{ent.midasi1}}</div>
				<div><input type="text" v-if="info.edit_mode==1" v-model="ent.midasi1" style="width:100%" /></div>
				
				<div  v-if="ent.text1 != '' " style="white-space:pre-wrap; word-wrap:break-word;">{{ ent.text1 }}</div>
				<textarea v-model="ent.text1" v-if="info.edit_mode==1" style="width:100%;height:100px"></textarea>
				
				<!-- QRコードまわり -->
				<table style="width:100%;margin-top:1em"><tr>
					<td>
						<div id="qr_code"></div>
					</td>
					<td style="vertical-align:bottom;text-align:right;color:#5a5a5a">
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
				
			</div><!-- l_div -->
			<div id="r_div" >
				<div style="width:100%;hight:50%;">
					<div  v-if="ent.midasi2 != '' "  id="ent.midasi2" class="midasi">{{ent.midasi2}}</div>
					<div><input type="text" v-if="info.edit_mode==1" v-model="ent.midasi2" style="width:100%" /></div>
					
					<div  v-if="ent.text2 != '' " style="white-space:pre-wrap; word-wrap:break-word;">{{ ent.text2 }}</div>
					<textarea v-model="ent.text2" v-if="info.edit_mode==1" style="width:100%;height:100px"></textarea>
					
					<div v-if="ent.midasi3 != '' "  id="ent.midasi3" class="midasi">{{ent.midasi3}}</div>
					<div><input type="text" v-if="info.edit_mode==1" v-model="ent.midasi3" style="width:100%" /></div>
					
					<div  v-if="ent.text3 != '' " style="white-space:pre-wrap; word-wrap:break-word;">{{ ent.text3 }}</div>
					<textarea v-model="ent.text3" v-if="info.edit_mode==1" style="width:100%;height:100px"></textarea>
				</div>
			</div><!-- r_div -->
		</div><!-- post_card -->
		<br>	
		
	</div><!-- new_flg -->
</div><!-- vue app -->


<input type="hidden" id="csrf_token" value="<?php echo $csrf_token;?>" />

<!-- 印刷用画像プレビュー -->
<div id="print_preview" style="background-color:#ceffce;padding:20px;display:none;">
	<p>印刷用画像プレビュー</p>
	<div>
		<button onclick="downloadImg2()" class="btn btn-success">画像ダウンロード</button>
		<button onclick="returnNormalMode()" class="btn btn-default">通常モードに戻る</button>
		<aside style="display:inline-block">「画像ダウンロード」ボタンがうまくいかない場合は、画像を右クリックで保存してください。</aside>
	</div>
	<img id="img2" src="" alt="" />
</div>



<div class="yohaku"></div>
<ol class="breadcrumb">
	<li><a href="/">ホーム</a></li>
</ol>
<div id="footer">(C) kenji uehara 2020-8-9 | 2020-8-23</div>
</div><!-- content -->

</body>
</html>