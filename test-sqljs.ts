import { MemoryModule } from './packages/memory/src/memory.js';

async function test() {
    console.log('Testing sql.js storage...');

    const memory = await MemoryModule.create({
        storage: 'sqlite',
        path: './data/test-sqljs.db'
    });

    console.log('✅ MemoryModule created');

    const entry = await memory.store('Test memory from sql.js');
    console.log('✅ Stored:', entry);

    const list = await memory.list();
    console.log('✅ List:', list);

    console.log('\n🎉 sql.js works!');
}

test().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
