rm -rf build/*;
mkdir -p build/mobile2;
cp index.html dist translations config.json localConfig.json favicon.ico build/mobile2 -r
cd build;
tar -czf mobile2.tar.gz mobile2
