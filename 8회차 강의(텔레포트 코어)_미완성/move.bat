chcp 65001

call tsc

rmdir "C:\Users\USER\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\TP Core[B]" /s /q
rmdir  "C:\Users\USER\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\TP Core[R]" /s /q

mkdir "C:\Users\USER\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\TP Core[B]"
mkdir "C:\Users\USER\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\TP Core[R]"

xcopy ".\UI 강의\behavior_pack" "C:\Users\USER\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\TP Core[B]" /E /y
xcopy ".\UI 강의\resource_pack" "C:\Users\USER\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\TP Core[R]" /E /y